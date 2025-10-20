import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import {
  getStoreProducts,
  getStoreProductsAsync,
  getTaskResult,
} from "../apis/products";
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
import { getDepartments } from "../apis/departments";

const StoreProductList = () => {
  const dispatch = useDispatch();
  const [storeProducts, setStoreProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({ only_stock: true });
  const user = getUserData();
  const [outOfStockPercentage, setoutOfStockPercentage] = useState(0);

  useEffect(() => {
    const fetchBrands = async () => {
      const response = await getBrands();
      setBrands(response.data);
      const response2 = await getDepartments();
      setDepartments(response2.data);
    };

    fetchBrands();
  }, []); // Solo se ejecuta una vez al montar

  function pollEvery3Seconds(taskId) {
    const interval = 3000;

    const intervalId = setInterval(async () => {
      try {
        const response = await getTaskResult(taskId); // tu llamada a la API
        console.log("Estado de la tarea:", response.data);

        if (response.data.status === "SUCCESS") {
          setStoreProducts(response.data.result);
          setLoading(false);
          clearInterval(intervalId); // detenemos el polling
        } else if (response.data.status === "FAILURE") {
          setLoading(false);
          clearInterval(intervalId); // también detenemos si falló
        }
      } catch (error) {
        console.error("Error al consultar tarea:", error);
        // Puedes decidir si parar el polling si hay error repetido
        // clearInterval(intervalId);
      }
    }, interval);
  }

  const fetchStoreProducts = async () => {
    console.log(params);
    setLoading(true);

    if (Object.keys(params).length === 1) {
      //      const response2 = await getStoreProductsAsync(params);
      //      console.log(response2);

      //      pollEvery3Seconds(response2.data.task_id)

      const response = await getStoreProducts(params);
      console.log(response);
      const storeProducts = response.data;
      setStoreProducts(storeProducts);

      const totalStoreProducts = storeProducts.length;
      const outOfStockCount = storeProducts.filter(
        (product) => product.stock === 0
      ).length;
      const outOfStockPercentage = (outOfStockCount / totalStoreProducts) * 100;
      setoutOfStockPercentage(outOfStockPercentage);
      setLoading(false);
    } else {
      const response = await getStoreProducts(params);
      console.log(response);
      const storeProducts = response.data;
      setStoreProducts(storeProducts);

      const totalStoreProducts = storeProducts.length;
      const outOfStockCount = storeProducts.filter(
        (product) => product.stock === 0
      ).length;
      const outOfStockPercentage = (outOfStockCount / totalStoreProducts) * 100;
      setoutOfStockPercentage(outOfStockPercentage);
      setLoading(false);
    }
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
          {" "}
          <Form.Label>Departamento</Form.Label>
          <Form.Select
            value={params.department_id}
            onChange={handleDataChange}
            name="department_id"
            //              disabled={isLoading}
          >
            <option value="">Todos las departamentos</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          <Form.Label>Código</Form.Label>
          <Form.Control
            type="text"
            value={params.code}
            onChange={handleDataChange}
            name="code"
          />
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
          {storeProducts.length > 0 && (
            <>{outOfStockPercentage.toFixed(0)}% de los productos esta vacio</>
          )}

          <CustomButton fullWidth onClick={fetchStoreProducts}>
            <SearchIcon /> Buscar
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
            sort: true
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
