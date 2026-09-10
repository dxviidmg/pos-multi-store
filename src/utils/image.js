import { logger } from "./logger";

/**
 * Convierte un archivo de imagen a formato WebP en el cliente, con opción de
 * redimensionar para reducir el peso manteniendo buena calidad.
 *
 * - Solo reduce el tamaño si la imagen excede `maxWidth`/`maxHeight` (no amplía).
 * - Si el navegador no soporta WebP o algo falla, devuelve el archivo original.
 *
 * @param {File} file - Archivo de imagen original.
 * @param {Object} [options]
 * @param {number} [options.quality=0.85] - Calidad WebP (0-1).
 * @param {number} [options.maxWidth=1000] - Ancho máximo en px.
 * @param {number} [options.maxHeight=1000] - Alto máximo en px.
 * @returns {Promise<File>} Archivo convertido a WebP, o el original como fallback.
 */
export const convertImageToWebp = (file, options = {}) => {
  const { quality = 0.85, maxWidth = 1000, maxHeight = 1000 } = options;

  return new Promise((resolve) => {
    // Si no es imagen o ya es webp, no hacer nada
    if (!file || !file.type?.startsWith("image/")) {
      resolve(file);
      return;
    }
    if (file.type === "image/webp") {
      resolve(file);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      try {
        let { width, height } = img;

        // Escalar solo si excede los límites (mantener proporción, sin ampliar)
        const scale = Math.min(1, maxWidth / width, maxHeight / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            // Fallback: navegador sin soporte WebP o conversión fallida
            if (!blob || blob.type !== "image/webp") {
              logger.warn("Conversión a WebP no soportada; se usa el archivo original");
              resolve(file);
              return;
            }
            const newName = file.name.replace(/\.[^.]+$/, "") + ".webp";
            const webpFile = new File([blob], newName, {
              type: "image/webp",
              lastModified: Date.now(),
            });
            resolve(webpFile);
          },
          "image/webp",
          quality
        );
      } catch (err) {
        logger.error("Error al convertir imagen a WebP:", err);
        resolve(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      logger.warn("No se pudo cargar la imagen para convertir; se usa el original");
      resolve(file);
    };

    img.src = objectUrl;
  });
};
