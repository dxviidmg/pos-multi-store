import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { getSellers } from "../apis/sellers";
import CustomButton from "../commons/customButton/CustomButton";
import { useDispatch } from "react-redux";
import { showSellerModal, hideSellerModal } from "../redux/sellerModal/SellerModalActions";
import SellerModal from "../sellerModal/SellerModal";
import { getDateDifference, getFormattedDate } from "../utils/utils";
import { chooseIcon } from "../commons/icons/Icons";
import { Grid, TextField, Box, Stack, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const SellerList = () => {
  const today = getFormattedDate();
  const dispatch = useDispatch();
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

  const handleOpenModal = (brand) => {
    dispatch(hideSellerModal());
    setTimeout(() => dispatch(showSellerModal(brand)));
  };

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
      <Grid container>
      <Grid item xs={12} className="custom-section">
        <SellerModal onUpdateSellerList={handleUpdateSellerList} />
        
        <Box>
          <Stack direction="row" justifyContent="space-between">
            <h1>Vendedores</h1>
            <CustomButton onClick={() => handleOpenModal()} startIcon={<AddIcon />}>
              Nuevo Vendedor
            </CustomButton>
          </Stack>
          <Divider />
        </Box>

        <Box component="form" className="pb-2">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Box controlId="start_date">
                <TextField size="small" fullWidth label="Fecha de inicio" name="start_date"
                  type="date"
                  value={params.start_date}
                  onChange={(e) => handleParams(e)}
                  max={today}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box controlId="end_date">
                <TextField size="small" fullWidth label="Fecha de fin" name="end_date"
                  type="date"
                  value={params.end_date}
                  onChange={(e) => handleParams(e)}
                  max={today}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box controlId="range">
                <TextField size="small" fullWidth label="Rango" name="range" type="input" value={range} disabled />
              </Box>
            </Grid>
          </Grid>
        </Box>
        <CustomTable
          progressPending={loading}
          data={sellers}
          pagination={false}
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
