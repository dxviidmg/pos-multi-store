import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable";
import CustomButton from "../commons/customButton/CustomButton";
import Searcher from "../commons/searcher/Searcher";
import { getStoreProducts } from "../apis/products";

const SearchProduct = () => {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log(query)

      if (query){
        const response = await getStoreProducts(query);
        setOptions(response.data);
      }
      else{
        setOptions([]);
      }

    };

    fetchData();
  }, [query]);

  return (
    <>
    <Searcher setQuery={setQuery} title="Productos" inputPlaceholder="Nombre o codigo"></Searcher>
      <CustomTable
        inputPlaceholder="Buscar producto"
        title="Productos"
        data={options}
        columns={[
          {
            name: "Codigo",
            selector: (row) => row.product_code,
            sortable: true,
          },
          {
            name: "Nombre",
            selector: (row) => row.product_name,
            sortable: true,
          },

          {
            name: "Marca",
            selector: (row) => row.brand_name,
            sortable: true,
          },

          {
            name: "Categoria",
            selector: (row) => row.category_name,
            sortable: true,
          },

          {
            name: "Cantidad",
            selector: (row) => row.quantity,
            sortable: true,
          },

          {
            name: "Acciones",
            selector: (props) => (
              <div>
                <CustomButton >
                Añadir
                </CustomButton>
              </div>
            ),
          },

        ]}
      ></CustomTable>
    </>
  );
};

export default SearchProduct;
