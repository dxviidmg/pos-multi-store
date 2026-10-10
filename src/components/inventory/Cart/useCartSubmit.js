import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { cleanCart } from "../../../redux/cart/cartActions";
import { confirmTransfers, createDistribution } from "../../../api/transfers";
import { addProducts } from "../../../api/products";
import { showSuccess, showWarning, showRequestError } from "../../../utils/alerts";

/**
 * Envío del carrito en traspaso, distribución y agregar inventario, con el destino elegido
 * (`selectedStore` + `confirmedStore`) y un candado contra doble envío.
 */
export const useCartSubmit = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedStore, setSelectedStore] = useState("");
  const [confirmedStore, setConfirmedStore] = useState("");
  const submittingRef = useRef(false);

  const isDestinationConfirmed = Boolean(selectedStore) && selectedStore === confirmedStore;

  // Ejecuta `request` con el spinner y el candado; `onError` decide la alerta (por defecto showRequestError)
  const submit = async (request, onError) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setLoading(true);
    try {
      await request();
    } catch (error) {
      onError(error);
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  const submitTransfer = (cart) =>
    submit(
      async () => {
        await confirmTransfers({ transfers: cart, destination_store: selectedStore });
        dispatch(cleanCart());
        showSuccess("Traspaso confirmado");
      },
      (error) => {
        if (error.response?.status === 404) {
          dispatch(cleanCart());
          showWarning("No se pudo confirmar el traspaso", "No coincide con un traspaso pendiente. Revisa la cantidad y el destino.");
        } else {
          showRequestError("confirmar el traspaso", error);
        }
      }
    );

  const submitDistribution = (cart) =>
    submit(
      async () => {
        await createDistribution({ products: cart, destination_store: selectedStore });
        dispatch(cleanCart());
        setSelectedStore("");
        setConfirmedStore("");
        showSuccess("Distribución creada");
      },
      (error) => {
        if (error.response?.status === 404) {
          showWarning("No se pudo crear la distribución", "Algunos productos no coinciden con la distribución solicitada, en cantidad o en código.");
        } else {
          showRequestError("crear la distribución", error);
        }
      }
    );

  const submitAddToStock = (cart) =>
    submit(
      async () => {
        const store_products = cart.map((item) => ({ id: item.id, stock: item.stock, quantity: item.quantity }));
        await addProducts({ store_products });
        dispatch(cleanCart());
        showSuccess("Producto agregado al inventario");
      },
      (error) => showRequestError("agregar el producto al inventario", error)
    );

  return {
    loading,
    selectedStore,
    setSelectedStore,
    confirmedStore,
    setConfirmedStore,
    isDestinationConfirmed,
    submitTransfer,
    submitDistribution,
    submitAddToStock,
  };
};
