import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { getStoreProducts } from "../apis/products";
import { Form } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { getUserData } from "../apis/utils";
import { exportToExcel } from "../utils/utils";
import {
  hideLogsModal,
  showLogsModal,
} from "../redux/logsModal/LogsModalActions";
import { useDispatch } from "react-redux";
import StoreProductLogsModal from "../storeproductlogsModal/StoreProductLogsModal";
import { CustomSpinner2 } from "../commons/customSpinner/CustomSpinner";
import { getBrands } from "../apis/brands";


const StoreProductList = () => {
  const dispatch = useDispatch();
  const [storeProducts, setStoreProducts] = useState([]);
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(false);
  const [brandId, setBrandId] = useState({})
  const user = getUserData();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response_store_products = await getStoreProducts();
      setStoreProducts(response_store_products.data);
      const response_brands = await getBrands()
      setBrands(response_brands.data)
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleDownload = async () => {
    const storeProductsForReport = storeProducts.map(
      ({
        product_code: Código,
        product_brand: Marca,
        product_name: Nombre,
        stock: Stock,
      }) => ({
        Código,
        Marca,
        Nombre,
        Stock,
      })
    );

    const prefixName = "Reporte Inventario " + getUserData().store_name;
    exportToExcel(storeProductsForReport, prefixName);
  };

  const handleOpenModal = (storeProduct, adjustStock) => {
    dispatch(hideLogsModal());
    setTimeout(() => dispatch(showLogsModal(storeProduct, adjustStock)), 1);
  };

  const handleUpdateStoreProductList = (updatedStoreProduct) => {
    setStoreProducts((prevStoreProducts) => {
      const StoreProductsExists = prevStoreProducts.some(
        (b) => b.id === updatedStoreProduct.id
      );
      return StoreProductsExists
        ? prevStoreProducts.map((b) =>
            b.id === updatedStoreProduct.id ? updatedStoreProduct : b
          )
        : [...prevStoreProducts, updatedStoreProduct];
    });
  };


  const handleDataChange = async (e) => {
    let { name, value } = e.target;
    setLoading(true)
    const response = await getStoreProducts(name, value)
    setBrandId(value)
    setStoreProducts(response.data)
    setLoading(false)
  };


  return (
    <div className="custom-section">
      <CustomSpinner2 isLoading={loading}></CustomSpinner2>
      <StoreProductLogsModal
        onUpdateStoreProductList={handleUpdateStoreProductList}
      />
      <Form.Label className="fw-bold">Inventario</Form.Label>

      <br />
      <CustomButton onClick={handleDownload}>Descargar inventario</CustomButton>

      <br/>
          <Form.Label>Marca</Form.Label>
            <Form.Select
              value={brandId}
              onChange={handleDataChange}
              name="brand_id"
//              disabled={isLoading}
            >
              <option value="">Selecciona una marca</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </Form.Select>
      <CustomTable
        searcher={true}
        progressPending={loading}
        data={storeProducts}
        columns={[
          {
            name: "Código",
            selector: (row) => row.product_code,
          },
          {
            name: "Marca",
            selector: (row) => row.product_brand,
          },
          {
            name: "Nombre",
            selector: (row) => row.product_name,
            grow: 3,
            wrap: true,
          },

          {
            name: "Stock",
            selector: (row) => row.stock,
          },
          {
            name: "Accciones",
            grow: 4,
            cell: (row) => (
              <>
                {user.is_owner && (
                  <CustomButton onClick={() => handleOpenModal(row, true)}>
                    Ajustar cantidad
                  </CustomButton>
                )}
                <CustomButton onClick={() => handleOpenModal(row, false)}>
                  Movimientos de stock {user.is_owner}
                </CustomButton>
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

export default StoreProductList;
