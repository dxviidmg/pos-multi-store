import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { getProducts } from "../apis/products";
import { Container, Form, Row, Col } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { useDispatch } from "react-redux";
import {
  hideProductModal,
  showProductModal,
} from "../redux/productModal/ProductModalActions";
import ProductModal from "../productModal/ProductModal";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await getProducts();
      setProducts(response.data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

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

  return (
    <Container fluid>
      <ProductModal onUpdateProductList={handleUpdateProductList} />
      <Row className="section">
        <Col md={12}>
          <Form.Label className="fw-bold">Lista de productos</Form.Label>

          <br />

          <CustomButton onClick={() => handleOpenModal()}>
            Crear producto
          </CustomButton>

          <CustomTable
            searcher={true}
            progressPending={isLoading}
            data={products}
            columns={[
              {
                name: "Código",
                selector: (row) => row.code,
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
                name: "Precio de compra",
                selector: (row) => "$" + row.purchase_price,
                wrap: true,
              },
              {
                name: "Precio de venta Uni.",
                selector: (row) => "$" + row.unit_sale_price,
              },
              {
                name: "Precio de venta May.",
                selector: (row) =>
                  row.apply_wholesale
                    ? "$" +
                      row.wholesale_sale_price +
                      " apartir de " +
                      row.min_wholesale_quantity
                    : "NA",
              },
              {
                name: "Accciones",
                cell: (row) => (
                  <CustomButton onClick={() => handleOpenModal(row)}>
                    Editar
                  </CustomButton>
                ),
              },
            ]}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ProductList;
