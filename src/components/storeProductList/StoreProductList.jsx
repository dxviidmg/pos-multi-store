import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { getStoreProducts } from "../apis/products";
import { Col, Form, Row } from "react-bootstrap";
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
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({});
  const user = getUserData();

  useEffect(() => {
    const fetchBrands = async () => {
        setLoading(true);
        const response = await getBrands();
        setBrands(response.data);
  
        if (Object.keys(params).length === 0 && response.data.length > 0) {
          setParams({ brand_id: response.data[0].id });
        }
        setLoading(false);
    };
  
    fetchBrands();
  }, []); // Solo se ejecuta una vez al montar
  
  useEffect(() => {
    const fetchStoreProducts = async () => {
      if (Object.keys(params).length === 0) return;
  
        setLoading(true);
        const response = await getStoreProducts(params);
        setStoreProducts(response.data);
        setLoading(false);
    };
  
    fetchStoreProducts();
  }, [params]);

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
    console.log(name, value);
    setParams((prevData) => ({ ...prevData, [name]: value }));
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

      <br />
      <Row>
        <Col>
          {" "}
          <Form.Label>Marca</Form.Label>
          <Form.Select
            value={params.brand_id}
            onChange={handleDataChange}
            name="brand_id"
            //              disabled={isLoading}
          >
            <option value="0">Selecciona una marca</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          <Form.Label>Stock maximo</Form.Label>
          <Form.Control
            type="number"
            value={params.max_stock}
            onChange={handleDataChange}
            name="max_stock"
          />
        </Col>
      </Row>

      <CustomTable
        searcher={true}
        progressPending={loading}
        data={storeProducts}
        columns={[
          {
            name: "Código",
            selector: (row) => row.product.code,
            grow: 2,
          },
          {
            name: "Marca",
            selector: (row) => row.product.brand_name,
          },
          {
            name: "Nombre",
            selector: (row) => row.product.name,
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
