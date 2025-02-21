import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { getProducts } from "../apis/products";
import { Form} from "react-bootstrap";
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
  const [isLoading, setIsLoading] = useState(false);
  const [brands, setBrands] = useState([])
  const [brandId, setBrandId] = useState({})
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response_products = await getProducts();
      setProducts(response_products.data);
      const response_brands = await getBrands()
      setBrands(response_brands.data)
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


  const handleDownload = async () => {
    const storeProductsForReport = products.map(({ code: Código, brand_name: Marca, name: Nombre, stock: Stock, cost: Costo, unit_price: PrecioUnitario, wholesale_price: PrecioMayoreo, min_wholesale_quantity: CantidadMinimaMayoreo, wholesale_price_on_client_discount: PMDC}) => ({
      Código,
      Marca,
      Nombre,
      Stock,
      Costo,
      'Precio unitario': PrecioUnitario,
      'Precio mayoreo': PrecioMayoreo,
      'Cantidad minima mayoreo': CantidadMinimaMayoreo,
      'Precio Mayoreo en descuento de clientes': PMDC
    }));
    
    const prefixName = "Productos"
     exportToExcel(storeProductsForReport, prefixName)
  };

  const handleDataChange = async (e) => {
    let { name, value } = e.target;
    setIsLoading(true)
    const response = await getProducts(name, value)
    setBrandId(value)
    setProducts(response.data)
    setIsLoading(false)
  };

  return (
    <div className="custom-section">
      <CustomSpinner2 isLoading={isLoading}></CustomSpinner2>
      <ProductModal onUpdateProductList={handleUpdateProductList} />
          <Form.Label className="fw-bold">Lista de productos</Form.Label>

          <br />

          <CustomButton onClick={() => handleOpenModal()}>
            Crear producto
          </CustomButton>
          <CustomButton onClick={handleDownload}>Descargar productos</CustomButton>

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
                selector: (row) =>
                  row.apply_wholesale
                    ? "$" +
                      row.wholesale_price +
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
    </div>
  );
};

export default ProductList;
