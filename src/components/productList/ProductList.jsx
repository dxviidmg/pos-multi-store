import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { deleteProducts, getProducts } from "../apis/products";
import { Col, Form, FormCheck, Row } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { useDispatch } from "react-redux";
import {
  hideProductModal,
  showProductModal,
  showProductModal2,
} from "../redux/productModal/ProductModalActions";
import ProductModal from "../productModal/ProductModal";
import { exportToExcel } from "../utils/utils";
import { CustomSpinner2 } from "../commons/customSpinner/CustomSpinner";
import { getBrands } from "../apis/brands";
import { getUserData } from "../apis/utils";
import Swal from "sweetalert2";
import { EditIcon, QrCodeIcon, SearchIcon } from "../commons/icons/Icons";
import { getDepartments } from "../apis/departments";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [params, setParams] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      const response = await getBrands();
      setBrands(response.data);
      const response2 = await getDepartments();
      setDepartments(response2.data);

      //quitamos marca default
      if (Object.keys(params).length === 0 && response.data.length > 0) {
        setParams({ brand_id: response.data[0].id });
      }
      setLoading(false);
    };

    fetchBrands();
  }, []); // Solo se ejecuta una vez al montar

  useEffect(() => {
    const fetchStoreProducts = async () => {
      setLoading(true);
      const response = await getProducts(params);
      setProducts(response.data);
      setLoading(false);
    };

    fetchStoreProducts();
  }, [params]);

  const handleOpenModal = (brand) => {
    dispatch(hideProductModal());
    setTimeout(() => dispatch(showProductModal(brand)));
  };

  const handleOpenModal2 = (brand) => {
    dispatch(hideProductModal());
    setTimeout(() => dispatch(showProductModal2(brand)));
  };

  const handleUpdateProductList = (updatedProduct) => {
    setProducts((prevProducts) => {
      const productExists = prevProducts.some(
        (b) => b.id === updatedProduct.id
      );
      return productExists
        ? prevProducts.map((b) =>
            b.id === updatedProduct.id ? updatedProduct : b
          )
        : [...prevProducts, updatedProduct];
    });
  };

  const handleDownload = async () => {
    const storeProductsForReport = products.map(
      ({
        code: Código,
        brand_name: Marca,
        name: Nombre,
        stock: Stock,
        cost: Costo,
        unit_price: PrecioUnitario,
        wholesale_price: PrecioMayoreo,
        min_wholesale_quantity: CantidadMinimaMayoreo,
        wholesale_price_on_client_discount: PMDC,
        image: Imagen,
      }) => ({
        Código,
        Marca,
        Nombre,
        Stock,
        Costo,
        "Precio unitario": PrecioUnitario,
        "Precio mayoreo": PrecioMayoreo,
        "Cantidad minima mayoreo": CantidadMinimaMayoreo,
        "Precio Mayoreo en descuento de clientes": PMDC,
        Imagen,
      })
    );

    const prefixName = "Productos";
    exportToExcel(storeProductsForReport, prefixName);
  };

  const handleDataChange = async (e) => {
    let { name, value } = e.target;
    console.log(name, value);
    setParams((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDeleteProducts = async () => {
    const stockCount = selectedRows.reduce(
      (sum, element) => sum + element.stock,
      0
    );

    if (stockCount > 0) {
      Swal.fire({
        icon: "error",
        title: "Error al borrar productos",
        text: "Los productos no deben tener stock cero para ser borrados",
        timer: 5000,
      });
      return;
    }

    const selectedIds = selectedRows.map((element) => element.id);
    const response = await deleteProducts(selectedIds);

    console.log(response);
    if (response.status === 200) {
      const updatedProducts = products.filter(
        (product) => !selectedIds.includes(product.id)
      );

      setProducts(updatedProducts);

      Swal.fire({
        icon: "success",
        title: "Productos eliminados",
        timer: 5000,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al borrar Productos",
        timer: 5000,
      });
    }
  };
  const handleCheck = (e) => {
    setConfirmDeletion(e.target.checked);
  };

  const handleGenerate = (code) => {
    if (code.trim() === "") return;
    const url = `https://barcodeapi.org/api/code128/${encodeURIComponent(
      code
    )}`;
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `barcode_${code}.png`;
        link.click();
      });
  };

  return (
    <div className="custom-section">
      <CustomSpinner2 isLoading={loading}></CustomSpinner2>
      <ProductModal onUpdateProductList={handleUpdateProductList} />
      <Form.Label className="fw-bold">Lista de productos</Form.Label>

      <div className="d-flex align-items-center gap-3">
        <CustomButton onClick={() => handleOpenModal()}>
          Crear producto
        </CustomButton>
        <CustomButton onClick={handleDownload}>
          Descargar productos
        </CustomButton>

        <CustomButton
          onClick={handleDeleteProducts}
          disabled={
            selectedRows.length === 0 ||
            !confirmDeletion ||
            getUserData().role !== "owner"
          }
        >
          Borrar productos
        </CustomButton>

        <FormCheck
          label="Confirmar borrado"
          checked={confirmDeletion}
          onChange={handleCheck}
        />
      </div>

      <Row className="mt-3">
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
                {brand.name} ({brand.product_count})
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col hidden={departments.length === 0}>
          {" "}
          <Form.Label>Departamento</Form.Label>
          <Form.Select
            value={params.department_id}
            onChange={handleDataChange}
            name="department_id"
            //              disabled={isLoading}
          >
            <option value="">Todos los departamentos</option>
            <option value="0">Sin departamento</option>
            {departments.map((departments) => (
              <option key={departments.id} value={departments.id}>
                {departments.name} ({departments.product_count})
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
        setSelectedRows={setSelectedRows}
        searcher={true}
        progressPending={loading}
        data={products}
        columns={[
          {
            name: "Código",
            selector: (row) => row.code,
            grow: 2,
          },
          {
            name: "Marca",
            selector: (row) => row.brand_name,
            wrap: true,
          },

          {
            name: "Departamento",
            selector: (row) => row.department_name,
          },
          {
            name: "Nombre",
            selector: (row) => row.name,
            grow: 2,
            wrap: true,
          },
          {
            name: "Stock",
            selector: (row) => row.stock,
            omit: getUserData().role !== "owner",
          },

          {
            name: "Costo",
            selector: (row) => "$" + row.cost,
            wrap: true,
          },

          {
            grow: 2,
            name: "Precios",
            cell: (row) => (
              <>
                Unitario: ${row.unit_price}
                <br />
                Mayoreo:{" "}
                {row.apply_wholesale
                  ? "$" +
                    row.wholesale_price +
                    " (" +
                    row.min_wholesale_quantity +
                    "+)"
                  : "NA"}
              </>
            ),
          },

          {
            name: "Acciones",
            grow: getUserData().role !== "owner" ? 1 : 2,
            cell: (row) => (
              <>
                <CustomButton onClick={() => handleOpenModal(row)}>
                  <EditIcon></EditIcon>
                </CustomButton>
                <CustomButton
                  onClick={() => handleOpenModal2(row)}
                  hidden={getUserData().role !== "owner"}
                >
                  <SearchIcon></SearchIcon>
                </CustomButton>
                <CustomButton onClick={() => handleGenerate(row.code)}>
                  <QrCodeIcon></QrCodeIcon>
                </CustomButton>
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

export default ProductList;
