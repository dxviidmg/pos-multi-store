import React, { useEffect, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import { getSellers } from "../../../api/sellers";
import CustomButton from "../../ui/Button/Button";
import SellerModal from "../SellerModal/SellerModal";
import { getFormattedDate, upsertById, formatCurrency } from "../../../utils/utils";
import { showRequestError } from "../../../utils/alerts";
import { isOwner } from "../../../constants/routeAccess";
import { useModal } from "../../../hooks/useModal";
import { useUserManagement } from "../../../hooks/useUserManagement";
import UserManagementModals from "../../ui/UserModals/UserManagementModals";
import PageHeader from "../../ui/PageHeader";
import DateRangeFilter from "../../ui/DateRangeFilter/DateRangeFilter";
import { Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useUser } from "../../../context/UserContext";
import CustomTooltip from "../../ui/Tooltip";

const DATE_ITEM_PROPS = { xs: 12, sm: 6, md: 4 };

const SellerList = () => {
  const today = getFormattedDate();
  const { user } = useUser();
  const sellerModal = useModal();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);

  const userManagement = useUserManagement();
  const { handleOpenEditUser, handleOpenChangePassword } = userManagement;

  const [params, setParams] = useState({
    end_date: today,
    start_date: today,
  });

  useEffect(() => {
    let ignore = false;
    const fetchSellersData = async () => {
      setLoading(true);
      try {
        const sellersResponse = await getSellers(params);
        if (!ignore) setSellers(sellersResponse.data);
      } catch (error) {
        if (!ignore) showRequestError("cargar los vendedores", error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchSellersData();
    return () => {
      ignore = true;
    };
  }, [params]);

  const handleUpdateSellerList = (updated) => {
    setSellers((prev) => upsertById(prev, updated));
  };

  const handleParams = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <SellerModal
        isOpen={sellerModal.isOpen}
        onClose={sellerModal.close}
        onUpdate={handleUpdateSellerList}
      />

      <UserManagementModals management={userManagement} />
      
      <Grid container>
        <Grid item xs={12} className="card">
          <PageHeader title="Vendedores">
            <CustomButton fullWidth onClick={() => sellerModal.open()} startIcon={<AddIcon />}>
              Nuevo vendedor
            </CustomButton>
          </PageHeader>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <DateRangeFilter
              startDate={params.start_date}
              endDate={params.end_date}
              onChange={handleParams}
              showRange
              itemProps={DATE_ITEM_PROPS}
            />
          </Grid>

          <DataTable
            progressPending={loading}
            noDataComponent="Sin vendedores"
            searcher
            data={sellers}
            columns={[
              {
                name: "Tienda",
                selector: (row) => row.store_detail?.name,
              },
              {
                name: "Usuario",
                cell: (row) => (
                  <div>
                    <div>{row.worker.username}</div>
                    <div>{`${row.worker.first_name} ${row.worker.last_name}`}</div>
                  </div>
                ),
              },
              {
                name: "Vendido",
                selector: (row) => formatCurrency(row.total_sales),
              },
              ...(isOwner(user) ? [{
                name: "Acciones",
                cell: (row) => (
                  <>
                    <CustomTooltip text="Editar usuario">
                      <CustomButton onClick={() => handleOpenEditUser(row.worker.id)}>
                        <EditIcon />
                      </CustomButton>
                    </CustomTooltip>
                    <CustomTooltip text="Cambiar contraseña">
                      <CustomButton onClick={() => handleOpenChangePassword(row.worker.id)}>
                        <LockResetIcon />
                      </CustomButton>
                    </CustomTooltip>
                  </>
                ),
              }] : []),
            ]}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default SellerList;
