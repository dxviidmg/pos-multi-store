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
import { SearchIcon } from "../commons/icons/Icons";

const StoreProductList = () => {
  const dispatch = useDispatch();
  const [storeProducts, setStoreProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({});
  const user = getUserData();
  const [outOfStockPercentage, setoutOfStockPercentage] = useState(0);

  useEffect(() => {
    const fetchBrands = async () => {
      const response = await getBrands();
      setBrands(response.data);
    };

    fetchBrands();
  }, []); // Solo se ejecuta una vez al montar

    const fetchStoreProducts = async () => {
      setLoading(true);
      const response = await getStoreProducts(params);
      const storeProducts = response.data;
      setStoreProducts(storeProducts);


      const totalStoreProducts = storeProducts.length;


      const outOfStockCount = storeProducts.filter(product => product.stock === 0).length;
      const outOfStockPercentage = (outOfStockCount / totalStoreProducts) * 100;
      setoutOfStockPercentage(outOfStockPercentage)

      setTimeout(() => {
        setLoading(false);
      }, 500); // 1000 milisegundos = 1 segundo
    };

  const handleDownload = async () => {
    const storeProductsForReport = storeProducts.map(
      ({
        product: { code: Código, brand_name: Marca, name: Nombre },
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
    setParams((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="custom-section">
      <CustomSpinner2 isLoading={loading}></CustomSpinner2>
      <StoreProductLogsModal
        onUpdateStoreProductList={handleUpdateStoreProductList}
      />
      <h1>Inventario</h1>

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
            <option value="">Todas las marcas</option>
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

        <Col className="d-flex flex-column justify-content-end">

{storeProducts.length > 0 && (<>{outOfStockPercentage.toFixed(0)}% de los productos esta vacio</>)}

  <CustomButton fullWidth onClick={fetchStoreProducts}>
  <SearchIcon/> Buscar
  </CustomButton>
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
            name: "Acciones",
            grow: 4,
            cell: (row) => (
              <>
                {user.role === "owner" && (
                  <CustomButton onClick={() => handleOpenModal(row, true)}>
                    Ajustar cantidad
                  </CustomButton>
                )}
                <CustomButton onClick={() => handleOpenModal(row, false)}>
                  Movimientos de stock
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
