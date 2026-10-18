import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatLongDate } from "../../../utils/utils";
import { buildCatalogRows, getCatalogHead } from "./catalogData";

const IMAGE_SIZE_MM = 16;
const IMAGE_MAX_PX = 300;
const IMAGE_CONCURRENCY = 6;
const MARGIN_MM = 14;
const NAVY = [18, 26, 69];
const SMARTVENTA_URL = "https://smartventapos.vercel.app/";

/** Descarga una imagen y la reduce a JPEG ≤300 px. Devuelve `null` si no se puede leer (p. ej. CORS). */
const loadImageData = (url) =>
  new Promise((resolve) => {
    if (!url) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const scale = Math.min(1, IMAGE_MAX_PX / img.width, IMAGE_MAX_PX / img.height);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve({ data: canvas.toDataURL("image/jpeg", 0.8), ratio: img.width / img.height });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });

/** Carga las imágenes de los productos con concurrencia limitada; conserva el orden. */
const loadImages = async (products) => {
  const results = new Array(products.length).fill(null);
  let next = 0;
  const worker = async () => {
    while (next < products.length) {
      const index = next++;
      results[index] = await loadImageData(products[index].image);
    }
  };
  await Promise.all(Array.from({ length: Math.min(IMAGE_CONCURRENCY, products.length) }, worker));
  return results;
};

const addFooter = (doc) => {
  const pages = doc.getNumberOfPages();
  const { width, height } = doc.internal.pageSize;
  doc.setFontSize(8);
  doc.setTextColor(140);
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page);
    doc.textWithLink("Catálogo hecho en SmartVenta · smartventapos.vercel.app", MARGIN_MM, height - 8, { url: SMARTVENTA_URL });
    doc.text(`Página ${page} de ${pages}`, width - MARGIN_MM, height - 8, { align: "right" });
  }
};

/**
 * Arma el PDF del catálogo. Con `withImages` carga las miniaturas; las que no se puedan
 * leer quedan vacías y se cuentan en `failedImages`.
 * @returns {Promise<{ doc: jsPDF, failedImages: number }>}
 */
export const buildCatalogPdf = async ({ business, title, validUntil, products, withImages, withWholesale }) => {
  const images = withImages ? await loadImages(products) : [];
  const doc = new jsPDF();

  doc.setTextColor(...NAVY);
  doc.setFontSize(20);
  doc.text(title, doc.internal.pageSize.width / 2, 20, { align: "center" });
  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text(business || "", MARGIN_MM, 29);
  doc.text(`Válido hasta el ${formatLongDate(validUntil)}`, doc.internal.pageSize.width - MARGIN_MM, 29, { align: "right" });

  const rows = buildCatalogRows(products, withWholesale);
  const priceColumn = withImages ? 3 : 2;
  autoTable(doc, {
    startY: 35,
    margin: { left: MARGIN_MM, right: MARGIN_MM, bottom: 16 },
    head: [[...(withImages ? ["Imagen"] : []), ...getCatalogHead(withWholesale)]],
    body: rows.map((row) => (withImages ? ["", ...row] : row)),
    headStyles: { fillColor: NAVY },
    styles: { fontSize: 9, valign: "middle", ...(withImages && { minCellHeight: IMAGE_SIZE_MM + 2 }) },
    columnStyles: {
      [priceColumn]: { halign: "right", cellWidth: 28 },
      ...(withWholesale && { [priceColumn + 1]: { halign: "right", cellWidth: 28 }, [priceColumn + 2]: { halign: "right", cellWidth: 32 } }),
      ...(withImages && { 0: { cellWidth: IMAGE_SIZE_MM + 6 } }),
    },
    didDrawCell: ({ section, column, row, cell }) => {
      if (!withImages || section !== "body" || column.index !== 0) return;
      const image = images[row.index];
      if (!image) return;
      const height = Math.min(IMAGE_SIZE_MM, IMAGE_SIZE_MM / image.ratio);
      const width = height * image.ratio;
      doc.addImage(image.data, "JPEG", cell.x + 3 + (IMAGE_SIZE_MM - width) / 2, cell.y + 1 + (IMAGE_SIZE_MM - height) / 2, width, height);
    },
  });
  addFooter(doc);

  return { doc, failedImages: images.filter((image, i) => !image && products[i].image).length };
};
