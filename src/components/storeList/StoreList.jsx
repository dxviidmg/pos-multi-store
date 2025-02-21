import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Form} from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { getStoreInvestment, getStores } from "../apis/stores";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CustomSpinner2 } from "../commons/customSpinner/CustomSpinner";


const StoreList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingInvesment, setLoadingInvestment] = useState(false);
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
      <CustomSpinner2 isLoading={loadingInvesment}></CustomSpinner2>

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
                selector: (row) => row.investment,
              },
              {
                name: "Ganancia del dia",
                selector: (row) => row.cash_summary[10]["amount"],
              },
              {
                name: "Efectivo",
                selector: (row) => row.cash_summary[0]["amount"],
              },
              {
                name: "Tarjeta",
                selector: (row) => row.cash_summary[1]["amount"],
              },
              {
                name: "Transferencia",
                selector: (row) => row.cash_summary[2]["amount"],
              },
              {
                name: "Total de ventas",
                selector: (row) => row.cash_summary[4]["amount"],
              },
              {
                name: "Ef. en caja",
                selector: (row) => row.cash_summary[9]["amount"],
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
