import React, { useEffect, useState } from "react";
import { useForm } from "../../../hooks/useForm";
import CustomModal from "../../ui/Modal/Modal";
import DataTable from "../../ui/DataTable/DataTable";
import { getStoreProductLogs, updateStoreProduct } from "../../../api/products";
import { getFormattedDateTime } from "../../../utils/utils";
import Swal from "sweetalert2";
import CustomButton from "../../ui/Button/Button";
import { chooseIcon } from "../../ui/Icons/Icons";
import { Grid, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const INITIAL_FORM_DATA = {};

const StoreProductLogsModal = ({ isOpen, logs: logsData, onClose, onUpdate }) => {
  const storeProduct = logsData?.storeProduct || {};
  const adjustStock = logsData?.adjustStock || false;

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchStoreProductLogs = async () => {
      if (storeProduct.id) {
        setFormData(storeProduct);

        try {
          const response = await getStoreProductLogs({
            "store-product-id": storeProduct.id
        } );
          setLogs(response.data);
        } catch (error) {
          // Error silencioso - logs no críticos
        }
      } else {
        setFormData(INITIAL_FORM_DATA);
        setLogs([]);
      }
    };

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
      onClose();
      onUpdate(response.data);
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
      showOut={isOpen}
      onClose={onClose}
      title={adjustStock ? "Ajuste de stock" : "Movimientos de stock"}
    >
     <Grid container sx={{ padding: '1rem', backgroundColor: 'rgba(4, 53, 107, 0.2)' }}>
       <Grid item xs={12} className="card">
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
          <DataTable
            data={logs}
            columns={[
              {
                name: "Fecha",
                selector: (row) => getFormattedDateTime(row.created_at),
                grow: 2,
                wrapText: true,
              },
              {
                name: "Descripcion",
                selector: (row) => row.description,
                grow: 2,
                wrapText: true,
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
                wrapText: true,
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
      </Grid>
     </CustomModal>
  );
};

export default StoreProductLogsModal;
