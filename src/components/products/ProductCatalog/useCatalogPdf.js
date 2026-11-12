import { useCallback, useState } from "react";
import { getCatalogFileName } from "./catalogData";
import { showRequestError, showWarning } from "../../../utils/alerts";

/**
 * Genera y descarga el PDF del catálogo. `jspdf` se carga solo al pulsar el botón.
 */
export const useCatalogPdf = () => {
  const [generating, setGenerating] = useState(false);

  const download = useCallback(async (options) => {
    setGenerating(true);
    try {
      const { buildCatalogPdf } = await import("./catalogPdf");
      const { doc, failedImages } = await buildCatalogPdf(options);
      doc.save(getCatalogFileName(options.title));
      if (failedImages > 0) {
        showWarning("Algunas imágenes no se incluyeron", `No se pudieron leer ${failedImages} imagen(es); esos productos salen sin imagen.`);
      }
    } catch (error) {
      showRequestError("generar el PDF", error);
    } finally {
      setGenerating(false);
    }
  }, []);

  return { generating, download };
};
