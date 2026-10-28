import { useEffect, useState } from "react";
import { useCatalogOptions, useInvalidateCatalogOptions } from "../shared/useCatalogOptions";
import { getPriceErrors, isProductFormIncomplete } from "./productValidation";
import { createProduct, getStoreProducts, updateProduct, addProducts } from "../../../api/products";
import { useUser } from "../../../context/UserContext";
import { useForm } from "../../../hooks/useForm";
import { useConversionUnits } from "../../../hooks/useConversions";
import { isOwner } from "../../../constants/routeAccess";
import { convertImageToWebp } from "../../../utils/image";
import { showSuccess, showRequestError, showWarning } from "../../../utils/alerts";
import noPhoto from "../../../assets/images/noPhoto.webp";

const INITIAL_FORM_DATA = {
  brand: "",
  department: "",
  code: "",
  name: "",
  unit: "PZ",
  cost: "",
  unit_price: "",
  wholesale_price: "",
  min_wholesale_quantity: "",
  wholesale_price_on_client_discount: false,
  image: null,
  initial_stock: "",
};

const CODE_CHECK_DELAY = 500;

/** Lee un archivo como data URL para la vista previa. */
const readAsDataUrl = (file, onLoad) => {
  const reader = new FileReader();
  reader.onloadend = () => onLoad(reader.result);
  reader.readAsDataURL(file);
};

/**
 * Estado y acciones del formulario de producto, compartido por `ProductModal` y la página
 * `ProductCreate`. `productData` es el producto a editar (o `{ code }` para uno nuevo);
 * `onSaved` recibe el producto guardado.
 */
export const useProductForm = ({ productData, createFromSearch = false, onSaved }) => {
  const { user } = useUser();

  const isCreating = !productData.id;
  const canEditPrices = createFromSearch || isCreating || isOwner(user);
  const isSingleStoreInside = !user.multistore && !!user.store_id;

  const { brands, departments, loaded: optionsLoaded } = useCatalogOptions();
  const invalidateCatalogOptions = useInvalidateCatalogOptions();
  const { values: formData, handleChange: handleDataChange, setValues: setFormData, setValue: setFormValue } = useForm(INITIAL_FORM_DATA);
  const { data: units = [] } = useConversionUnits();

  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [codeExists, setCodeExists] = useState(false);

  useEffect(() => {
    if (productData.id) {
      setFormData({
        ...INITIAL_FORM_DATA,
        ...productData,
        brand: productData.brand || "",
        department: productData.department || "",
        code: productData.code || "",
        name: productData.name || "",
        unit: productData.unit || "PZ",
        cost: productData.cost || "",
        unit_price: productData.unit_price || "",
        wholesale_price: productData.wholesale_price || "",
        min_wholesale_quantity: productData.min_wholesale_quantity || "",
      });
      setPreviewImage(productData.image || noPhoto);
    } else {
      setFormData({
        ...INITIAL_FORM_DATA,
        code: productData.code || "",
        initial_stock: createFromSearch ? "1" : "",
      });
      setPreviewImage(noPhoto);
    }
  }, [productData, createFromSearch, setFormData]);

  // Validar si el código ya existe (solo al crear); se descarta la respuesta si el código cambió
  useEffect(() => {
    if (!isCreating || !formData.code) {
      setCodeExists(false);
      return undefined;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await getStoreProducts({ code: formData.code, all_stores: "Y" }, { signal: controller.signal });
        if (!controller.signal.aborted) setCodeExists(response.data.length > 0);
      } catch {
        if (!controller.signal.aborted) setCodeExists(false);
      }
    }, CODE_CHECK_DELAY);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [formData.code, isCreating]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Convertir a WebP (más ligero) antes de guardar; con fallback al original
    const webpFile = await convertImageToWebp(file);
    setFormValue("image", webpFile);
    readAsDataUrl(webpFile, setPreviewImage);
  };

  const addInitialStock = async (createdProduct, quantity) => {
    try {
      const storeProducts = await getStoreProducts({ code: formData.code });
      if (storeProducts.data.length > 0) {
        await addProducts({ store_products: [{ id: storeProducts.data[0].id, quantity }] });
        createdProduct.stock = (createdProduct.stock || 0) + quantity;
      }
    } catch {
      showWarning("Producto creado sin stock inicial", "No se pudo agregar el stock. Ajústalo desde Inventario.");
    }
  };

  const submit = async () => {
    setIsLoading(true);
    const apiCall = formData.id ? updateProduct : createProduct;

    // department "0" o vacío no se envía; initial_stock tampoco (se agrega aparte)
    const { initial_stock: initialStockValue, ...cleanFormData } = formData;
    if (cleanFormData.department === "0" || !cleanFormData.department) {
      delete cleanFormData.department;
    }

    try {
      const response = await apiCall(cleanFormData);
      if (!formData.id && isSingleStoreInside && initialStockValue && parseInt(initialStockValue) > 0) {
        await addInitialStock(response.data, parseInt(initialStockValue));
      }
      onSaved(response.data);
      invalidateCatalogOptions();
      setFormData(INITIAL_FORM_DATA);
      setPreviewImage(null);
      showSuccess(`Producto ${formData.id ? "actualizado" : "creado"}${isSingleStoreInside && initialStockValue ? ` con stock de ${initialStockValue}` : ""}`);
    } catch (error) {
      showRequestError(`${formData.id ? "actualizar" : "crear"} el producto`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const priceErrors = getPriceErrors(formData);
  const isFormIncomplete = isProductFormIncomplete(formData, { requiresInitialStock: !formData.id && isSingleStoreInside });

  return {
    user,
    formData,
    handleDataChange,
    setCatalogValue: (name) => (value) => setFormValue(name, value),
    previewImage,
    handleImageChange,
    isLoading,
    codeExists,
    canEditPrices,
    isSingleStoreInside,
    brands,
    departments,
    optionsLoaded,
    units,
    priceErrors,
    isSubmitDisabled: isFormIncomplete || priceErrors.hasAnyError || isLoading || codeExists,
    submit,
  };
};
