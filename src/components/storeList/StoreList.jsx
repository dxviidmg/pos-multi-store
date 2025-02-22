import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Form} from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { getStores } from "../apis/stores";
import { useNavigate } from "react-router-dom";
import { CustomSpinner2 } from "../commons/customSpinner/CustomSpinner";


const StoreList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getStores();
      setStores(response.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSelectStore = async (row) => {
    const user = JSON.parse(localStorage.getItem("user"));
    user.store_type = row.store_type;
    user.store_name = row.full_name;
    user.store_id = row.id;

    const updatedData = JSON.stringify(user);
    localStorage.setItem("user", updatedData);

    navigate("/vender/");
    window.location.reload();
  };

  return (
    <div className="custom-section">
      <CustomSpinner2 isLoading={loading}></CustomSpinner2>

          <Form.Label className="fw-bold">Lista de tiendas</Form.Label>
          <CustomTable
            progressPending={loading}
            data={stores}
            columns={[
              {
                name: "Nombre",
                selector: (row) => row.name,
              },

              {
                name: "Tipo",
                selector: (row) => row.store_type_display,
              },
              {
                name: "Inversión",
                selector: (row) => '$' + row.investment.toLocaleString(),
              },
              {
                name: "Ganancia del dia",
                selector: (row) => '$' + row.cash_summary[10]["amount"].toLocaleString(),
              },
              {
                name: "Efectivo",
                selector: (row) => '$' + row.cash_summary[0]["amount"].toLocaleString(),
              },
              {
                name: "Tarjeta",
                selector: (row) => '$' + row.cash_summary[1]["amount"].toLocaleString(),
              },
              {
                name: "Transferencia",
                selector: (row) => '$' + row.cash_summary[2]["amount"].toLocaleString(),
              },
              {
                name: "Total de ventas",
                selector: (row) => '$' + row.cash_summary[4]["amount"].toLocaleString(),
              },
              {
                name: "$ en caja",
                selector: (row) => '$' + row.cash_summary[9]["amount"].toLocaleString(),
              },
              {
                name: "Accciones",
                cell: (row) => (
                  <>
                    <CustomButton onClick={() => handleSelectStore(row)}>
                      Entrar
                    </CustomButton>
                  </>
                ),
              },
            ]}
          />

    </div>
  );
};

export default StoreList;
