import { useCallback, useRef } from "react";
import { updateProduct } from "../../../api/products";
import { convertImageToWebp } from "../../../utils/image";
import { showSuccess, showRequestError } from "../../../utils/alerts";

/**
 * Toma una foto con la cámara (input file con `capture`) y la guarda como imagen del producto.
 * Renderiza un `<input>` oculto con `inputProps` y llama `openCamera(product)` desde la acción.
 *
 * @param {Function} onUpdated - Recibe el producto actualizado
 */
export const useProductImageCapture = (onUpdated) => {
  const inputRef = useRef(null);
  const productRef = useRef(null);

  const openCamera = useCallback((product) => {
    productRef.current = product;
    inputRef.current.value = "";
    inputRef.current.click();
  }, []);

  const handleCapture = useCallback(async (e) => {
    const file = e.target.files[0];
    const product = productRef.current;
    if (!file || !product) return;

    try {
      const webpFile = await convertImageToWebp(file);
      const response = await updateProduct({ id: product.id, image: webpFile });
      onUpdated(response.data);
      showSuccess("Imagen actualizada");
    } catch (error) {
      showRequestError("actualizar la imagen", error);
    }
  }, [onUpdated]);

  return {
    openCamera,
    inputProps: { ref: inputRef, type: "file", accept: "image/*", capture: "environment", onChange: handleCapture },
  };
};
