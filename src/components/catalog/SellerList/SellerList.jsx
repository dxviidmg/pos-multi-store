import React, { useEffect, useState } from "react";
import CustomTable from "../../ui/Table/Table";
import { getSellers } from "../../../api/sellers";
import CustomButton from "../../ui/Button/Button";
import SellerModal from "../SellerModal/SellerModal";
import { getDateDifference, getFormattedDate } from "../../../utils/utils";
import { chooseIcon } from "../../ui/icons/Icons";
import { useModal } from "../../../hooks/useModal";
import { Grid, TextField, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const SellerList = () => {
  const today = getFormattedDate();
  const sellerModal = useModal();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState("");

  const [params, setParams] = useState({
    end_date: today,
    start_date: today,
  });

  useEffect(() => {
    const fetchSellersData = async () => {
      setLoading(true);
      const sellersResponse = await getSellers(params);
      setSellers(sellersResponse.data);
      setRange(getDateDifference(params.start_date, params.end_date));
      setLoading(false);
    };

    fetchSellersData();
  }, [params]);

  const handleUpdateSellerList = (updatedBrand) => {
    setSellers((prevBrands) => {
      const brandExists = prevBrands.some((b) => b.id === updatedBrand.id);
      return brandExists
        ? prevBrands.map((b) => (b.id === updatedBrand.id ? updatedBrand : b))
        : [...prevBrands, updatedBrand];
    });
  };

  const handleParams = async (e) => {
    let { name, value } = e.target;
    setParams((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      {/* 1. MODALS */}
      <SellerModal 
        isOpen={sellerModal.isOpen}
        seller={sellerModal.data}
        onClose={sellerModal.close}
        onUpdate={handleUpdateSellerList}
      />
      
      {/* 2. CONTENIDO PRINCIPAL */}
      <Grid container>
        <Grid item xs={12} className="custom-section">
          {/* 2.1 Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <h1>Vendedores</h1>
            <CustomButton onClick={() => sellerModal.open()} startIcon={<AddIcon />}>
              Nuevo Vendedor
            </CustomButton>
          </Stack>

          {/* 2.2 Filtros */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                size="small"
                fullWidth
                label="Fecha de inicio"
                name="start_date"
                type="date"
                value={params.start_date}
                onChange={handleParams}
                max={today}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                size="small"
                fullWidth
                label="Fecha de fin"
                name="end_date"
                type="date"
                value={params.end_date}
                onChange={handleParams}
                max={today}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                size="small"
                fullWidth
                label="Rango"
                name="range"
                type="input"
                value={range}
                disabled
              />
            </Grid>
          </Grid>

          {/* 2.3 Tabla */}
          <CustomTable
            progressPending={loading}
            data={sellers}
            pagination={true}
            columns={[
              {
                name: "Tienda",
                selector: (row) => row.store_detail?.name,
              },
              {
                name: "Username",
                selector: (row) => row.worker.username,
                grow: 2,
              },
              {
                name: "Nombre",
                selector: (row) =>
                  `${row.worker.first_name} ${row.worker.last_name}`,
              },
              {
                name: "Esta activo",
                selector: (row) => chooseIcon(row.worker.is_active),
              },
              {
                name: "Vendido",
                selector: (row) => `$${row.total_sales}`,
              },
            ]}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default SellerList;
