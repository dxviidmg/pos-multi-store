import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../commons/customTable";
import CustomButton from "../commons/customButton/CustomButton";
import { getStoreProducts } from "../apis/products";
import { addToCart } from "../redux/cart/cartActions";
import { Form, Table } from "react-bootstrap";
import { debounce } from 'lodash'; // Ensure you install lodash
import CustomModal from "../commons/customModal/customModal";


const SearchProduct = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [queryType, setQueryType] = useState("code");
  const dispatch = useDispatch();
  const [barcode, setBarcode] = useState("");
  const cart = useSelector((state) => state.cartReducer.cart);
  const [showModal, setShowModal] = useState(false);
  const [productStock, setProductStock] = useState({code:'xxx', name: '', stock: '', stock_in_other_stores: []});

  const fetchData = useCallback(debounce(async () => {
    if (!query) {
      setData([]);
      return;
    }

    const response = await getStoreProducts(queryType, query);
    const fetchedData = response.data;

    if (queryType === "code" && fetchedData.length === 1) {
      const product = fetchedData[0];
      
      if (product.stock === 0) {
        handleOpenModal(product)
      } else {
        const existingProductIndex = cart.findIndex(item => item.id === product.id);
        
        // Check if the product already exists in the cart
        if (existingProductIndex === -1) {
          dispatch(addToCart({ ...product, quantity: 1 }));
        } else {
          const productExists = cart[existingProductIndex];
          if (productExists.quantity < productExists.stock) {
            dispatch(addToCart({ ...product, quantity: 1 }));
          } else {
            console.log('ya llegaste al limite');
          }
        }
      }
      setQuery("");
    } else {
      setData(fetchedData);
    }
  }, 300), [query, queryType, dispatch, cart]); // Debouncing fetchData

  useEffect(() => {
    // Call fetchData only if there is a query
    if (query) {
      fetchData();
    }
    // Cleanup the debounce effect
    return () => {
      fetchData.cancel();
    };
  }, [fetchData, query]);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  const handleQueryTypeChange = (e) => {
    setQueryType(e.target.value);
    setQuery(""); // Reset the query when changing type
    setData([]); // Clear results
  };


  const handleKeyDown = (event) => {
    if (event.key === "Enter" && queryType === "code") {
      console.log("Código escaneado:", barcode);
      setQuery(barcode); // Update the query with the scanned code
      setBarcode(""); // Clear the barcode field
    }
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    
    // Only call fetchData if queryType is "q"
    if (queryType === "q") {
      fetchData();
    }
  };


  const handleOpenModal = (row) => {
    setShowModal(false)
    setTimeout(() => setShowModal(true), 1);
    setProductStock({code:row.product_code, name: row.description, stock: row.stock, stock_in_other_stores: row.stock_in_other_stores})
  };


  return (
    <>
          <CustomModal showOut={showModal} title='Revision de stock'>

          <p className="text-center"><b>Codigo:</b> {productStock.code} <b>Nombre:</b> {productStock.name}</p>
          
          {productStock.stock === 0 ? <p className="text-center"><b>Nota:</b> No hay stock de este producto en la tienda</p>: ''}
          <Table striped bordered hover>
    <thead>
      <tr>
        <th>Tienda/Amlacen</th>
        <th>Stock</th>
      </tr>
    </thead>
    <tbody>
      {productStock.stock_in_other_stores.map((stock, e) => (
        <tr key={e}>
          <td>{stock.store_name}</td>
          <td>{stock.stock}</td>
        </tr>
      ))}
    </tbody>
  </Table>
          </CustomModal>
      <Form.Label>Buscador de productos</Form.Label>
      <br />
      <Form.Label style={{ marginRight: "30px" }}>Tipo de búsqueda:</Form.Label>

      <Form.Check
        inline
        id="code"
        label="Por código de barras"
        type="radio"
        onChange={handleQueryTypeChange}
        value="code"
        checked={queryType === "code"}
      />
      <Form.Check
        inline
        id="description"
        label="Manual (Descripción)"
        type="radio"
        onChange={handleQueryTypeChange}
        value="q"
        checked={queryType === "q"}
      />
      <br />

      <Form.Control
        type="text"
        value={queryType === "code" ? barcode : query} // Use barcode if code
        placeholder="Buscar producto"
        onChange={
          queryType === "q" ? handleChange : (e) => setBarcode(e.target.value)
        } // Change input value based on type
        onKeyDown={queryType === "code" ? handleKeyDown : undefined} // Activate only if queryType is "code"
      />

      <CustomTable
        inputPlaceholder="Buscar producto"
        title="Productos"
        data={data}
        columns={[
          { name: "Código", selector: (row) => row.product_code },
          { name: "Descripción", cell: (row) => <div>{row.description}</div> },
          { name: "Stock", selector: (row) => row.stock },
          {
            name: "Precio unitario",
            selector: (row) => row.prices.unit_sale_price,
          },
          {
            name: "Precio mayoreo",
            selector: (row) =>
              row.prices.apply_wholesale
                ? `${row.prices.min_wholesale_quantity} o más a ${row.prices.wholesale_sale_price}`
                : "",
          },

          {
            name: "Acciones",
            selector: (row) => (
              <div className="d-flex gap-2">
                <CustomButton
                  onClick={() => handleAddToCart(row)}
                  disabled={row.stock === 0}
                  variant="primary"
                >
                  Añadir
                </CustomButton>
          

              </div>
            ),
          },
          


          {
            name: "Acciones",
            selector: (row) => (
              <div className="d-flex gap-2">
          
                <CustomButton
                  onClick={() => handleOpenModal(row)}
                  disabled={row.stock === 0}
                  variant="danger"
                >
                  Ver stock total
                </CustomButton>
              </div>
            ),
          },


        ]}
      />
    </>
  );
};

export default SearchProduct;
