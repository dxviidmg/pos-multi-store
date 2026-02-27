import React, { useEffect, useState } from "react";
import CustomModal from "../commons/customModal/customModal";

import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../commons/customTable/customTable";
import { getStoreProductLogs, updateStoreProduct } from "../../api/products";
import { getFormattedDateTime } from "../../utils/utils";
import { showSuccess, showError } from "../../utils/alerts";
import Swal from "sweetalert2";
import CustomButton from "../commons/customButton/CustomButton";
import { hideLogsModal } from "../../redux/logsModal/LogsModalActions";
import { chooseIcon } from "../commons/icons/Icons";
import { Grid, TextField } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import SaveIcon from "@mui/icons-material/Save";

const INITIAL_FORM_DATA = {};

const StoreProductLogsModal = ({ onUpdateStoreProductList }) => {
  const dispatch = useDispatch();
  const { showLogsModal, storeProduct, adjustStock } = useSelector(
    (state) => state.LogsModalReducer
  );

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchStoreProductLogs = async () => {
      if (storeProduct.id) {
        setFormData(storeProduct);

        try {
          // Esperamos la respuesta de getStoreProductLogs
          const response = await getStoreProductLogs({
            "store-product-id": storeProduct.id
        } );
          setLogs(response.data);
        } catch (error) {
          console.error("Error fetching store product logs:", error);
          // Manejo del error, puedes mostrar un mensaje o realizar alguna otra acción
        }
      } else {
        setFormData(INITIAL_FORM_DATA);
        setLogs([]);
      }
    };

    // Llamamos a la función asincrónica
    fetchStoreProductLogs();
  }, [storeProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCreateAdjustStock = async () => {
    const response = await updateStoreProduct(formData);

    if (response.status === 200) {
      setFormData(INITIAL_FORM_DATA);
      dispatch(hideLogsModal());
      onUpdateStoreProductList(response.data);
      Swal.fire({
        icon: "success",
        title: "Ajuste exitoso",
        timer: 5000,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al realizar el ajuste",
        text: "Por favor llame a soporte técnico",
        timer: 5000,
      });
    }
  };

  return (
    <CustomModal
      showOut={showLogsModal}
      onClose={() => dispatch(hideLogsModal())}
      title={adjustStock ? "Ajuste de stock" : "Movimientos de stock"}
    >
     <Grid className="custom-section">
     <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField size="small" fullWidth label="Código" type="text"
            value={formData.product?.code}
            placeholder="Código"
            disabled
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField size="small" fullWidth label="Marca" type="text"
            value={formData.product?.brand_name}
            placeholder="Marca"
            disabled
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField size="small" fullWidth label="Nombre" type="text"
            value={formData.product?.name}
            placeholder="Nombre"
            disabled
          />
        </Grid>
        <Grid item xs={12} md={adjustStock ? 3 : 6}>
          <TextField size="small" fullWidth label="Cantidad" type="text"
            value={formData.stock}
            placeholder="Cantidad"
            disabled={!adjustStock}
            name={"stock"}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12} md={3}
          className={`d-flex flex-column justify-content-end ${
            !adjustStock ? "d-none" : ""
          }`}
        >
          <CustomButton
            onClick={() => handleCreateAdjustStock()}
            fullWidth
            disabled={!adjustStock}
            startIcon={<SaveIcon />}
          >
            Ajustar
          </CustomButton>
        </Grid>

        <Grid item xs={12} md={12} className={adjustStock ? "d-none" : ""}>
        <h1>Utimos movimientos</h1>
          <CustomTable
            data={logs}
            columns={[
              {
                name: "Fecha",
                selector: (row) => getFormattedDateTime(row.created_at),
                grow: 2,
                wrap: true,
              },
              {
                name: "Descripcion",
                selector: (row) => row.description,
                grow: 2,
                wrap: true,
              },
              {
                name: "S. anterior",
                selector: (row) => row.previous_stock,
              },
              {
                name: "S. actualizado",
                selector: (row) => row.updated_stock,
              },
              {
                name: "Dif",
                selector: (row) => row.difference,
              },
              {
                name: "Hecho por",
                selector: (row) => row.user_username,
                grow: 3,
                wrap: true,
              },
              {
                name: "OK",
                selector: (row) => chooseIcon(row.is_consistent),
              },
            ]}
          />
        </Grid>
      </Grid>

      </Grid> 
     </CustomModal>
  );
};

export default StoreProductLogsModal;
