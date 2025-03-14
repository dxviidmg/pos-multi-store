import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { getProducts } from "../apis/products";
import { Col, Form, Row } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { useDispatch } from "react-redux";
import {
  hideProductModal,
  showProductModal,
} from "../redux/productModal/ProductModalActions";
import ProductModal from "../productModal/ProductModal";
import { exportToExcel } from "../utils/utils";
import { CustomSpinner2 } from "../commons/customSpinner/CustomSpinner";
import { getBrands } from "../apis/brands";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [params, setParams] = useState({});
  const dispatch = useDispatch();

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

  return (
    <div className="custom-section">
      <CustomSpinner2 isLoading={loading}></CustomSpinner2>
      <ProductModal onUpdateProductList={handleUpdateProductList} />
      <Form.Label className="fw-bold">Lista de productos</Form.Label>

      <br />

      <CustomButton onClick={() => handleOpenModal()}>
        Crear producto
      </CustomButton>
      <CustomButton onClick={handleDownload}>Descargar productos</CustomButton>

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
            <option value="">Selecciona una marca</option>
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
          },
          {
            name: "Costo",
            selector: (row) => "$" + row.cost,
            wrap: true,
          },
          {
            name: "Precio Unitario",
            selector: (row) => "$" + row.unit_price,
          },
          {
            name: "Precio Mayoreo.",
            wrap: true,
            selector: (row) =>
              row.apply_wholesale
                ? "$" +
                  row.wholesale_price +
                  " apartir de " +
                  row.min_wholesale_quantity
                : "NA",
          },


          {
            name: "Eliminar",
            selector: (row) => (
                <Form.Check
                  type="checkbox"
                  id={`default-${row.id}`}
                  //                checked={productsSaleToCancel.includes(row.id)}
                  //                onChange={() => handleSelectProduct(row)}
                />
            ),
          },

          {
            name: "Eliminar",
            selector: (row) => (
                <CustomButton onClick={() => handleOpenModal(row)}>
                  Borrar
                </CustomButton>
            ),
          },

          {
            name: "Accciones",
            cell: (row) => (
              <>
                {" "}
                <CustomButton onClick={() => handleOpenModal(row)}>
                  Editar
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
