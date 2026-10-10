import { useEffect, useCallback, useMemo, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import { Chip, Box, useMediaQuery, useTheme } from "@mui/material";
import CustomButton from "../../ui/Button/Button";
import PageHeader from "../../ui/PageHeader";
import CardGallery from "../../ui/CardGallery/CardGallery";
import { colors } from "../../../theme/colors";
import { getFormattedDate } from "../../../utils/date";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { useUser } from "../../../context/UserContext";
import { isOwner as isOwnerUser } from "../../../constants/routeAccess";
import { STORE_TYPES } from "../../../constants";
import { useStores } from "../../../hooks/useStores";
import { useTenantInfo } from "../../../hooks/useTenantInfo";
import { useDepartments } from "../../../hooks/useDepartments";
import { useSwitchStore } from "../../../hooks/useSwitchStore";
import { getInvestment } from "../../../api/stores";
import { useUserManagement } from "../../../hooks/useUserManagement";
import UserManagementModals from "../../ui/UserModals/UserManagementModals";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { getStoreColumns, getStorageColumns, getTotalColumns } from "./StoreList.columns";
import CreateStoreModal from "./CreateStoreModal";
import StoreCard from "./StoreCard";
import StoreKpiTiles from "./StoreKpiTiles";
import StoreListFilters from "./StoreListFilters";
import StoreQuickFilters from "./StoreQuickFilters";
import StorePaymentModal from "./StorePaymentModal";
import { resetStoreWithConfirm } from "./resetStoreDialog";
import { useModal } from "../../../hooks/useModal";
import { useCanCreateStore } from "../../../hooks/useCanCreateStore";
import { showRequestError } from "../../../utils/alerts";

const NOTICE_COLORS = { error: "error", warning: "warning" };

// Con estos filtros la fila de totales no aporta información
const FILTERS_WITHOUT_TOTALS = ["managers", "printer", "actions"];

const firstStoreButtonSx = {
  px: 4,
  py: 1.2,
  fontSize: "1rem",
  bgcolor: colors.sidebar,
  boxShadow: colors.shadow.brand,
  "&:hover": {
    boxShadow: colors.shadow.brandHover,
    transform: "translateY(-1px)",
  },
  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
};

const StoreList = () => {
  const { user } = useUser();
  const isOwner = isOwnerUser(user);
  const { switchStore } = useSwitchStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [storeInvestments, setStoreInvestments] = useState({});
  const [quickFilter, setQuickFilter] = useState("all");
  const [params, setParams] = useState(() => {
    const today = getFormattedDate();
    return { end_date: today, start_date: today, store_type: STORE_TYPES.STORE };
  });
  const hasDepartment = Boolean(params.department_id);
  const isStoreType = params.store_type === STORE_TYPES.STORE;

  const userManagement = useUserManagement();
  const { handleOpenEditUser, handleOpenChangePassword } = userManagement;

  const { data: storesData, isLoading: loadingStores } = useStores(params);
  const { data: tenantInfo = {}, isLoading: loadingTenant } = useTenantInfo();
  const { data: departments = [] } = useDepartments();

  const mpModal = useModal();
  const createStoreModal = useModal();
  const { data: canCreateData, refetch: refetchCanCreate } = useCanCreateStore();
  const createStoreBlocked = canCreateData && !canCreateData.can_create;

  const { open: openMpModal } = mpModal;
  useEffect(() => {
    if (tenantInfo.show_mp_modal) openMpModal();
  }, [tenantInfo.show_mp_modal, openMpModal]);

  const stores = useMemo(() => storesData?.stores || [], [storesData]);
  const totals = useMemo(() => storesData?.totals || {}, [storesData]);
  const loading = loadingStores || loadingTenant;

  const handleParams = useCallback((e) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleStoreType = useCallback((e) => {
    setQuickFilter("all");
    setParams((prev) => ({ ...prev, store_type: e.target.value }));
  }, []);

  const handleShowInvestmentForStore = useCallback(async (storeId) => {
    if (storeInvestments[storeId] !== undefined) return;

    try {
      const response = await getInvestment(storeId);
      setStoreInvestments((prev) => ({ ...prev, [storeId]: response.data }));
    } catch (error) {
      showRequestError("obtener la inversión", error);
    }
  }, [storeInvestments]);

  // Promedio de ventas para el indicador de color junto al nombre
  const averageSales = useMemo(() => {
    if (stores.length === 0) return 0;
    const totalSales = stores.reduce((sum, store) => sum + (store.cash_summary?.total_day || 0), 0);
    return totalSales / stores.length;
  }, [stores]);

  const filteredStores = useMemo(
    () => (quickFilter === "synced" ? stores.filter((store) => !store.has_all_products) : stores),
    [stores, quickFilter]
  );

  const sharedProps = useMemo(() => ({
    user,
    quickFilter,
    storeInvestments,
    handleSelectStore: switchStore,
    handleOpenEditUser,
    handleOpenChangePassword,
    handleShowInvestmentForStore,
    handleResetStore: resetStoreWithConfirm,
  }), [
    user,
    quickFilter,
    storeInvestments,
    switchStore,
    handleOpenEditUser,
    handleOpenChangePassword,
    handleShowInvestmentForStore,
  ]);

  const columns = useMemo(() => (
    isStoreType
      ? getStoreColumns({ ...sharedProps, averageSales, hasDepartment })
      : getStorageColumns(sharedProps)
  ), [isStoreType, sharedProps, averageSales, hasDepartment]);

  const totalColumns = useMemo(
    () => getTotalColumns({ quickFilter, hasDepartment }),
    [quickFilter, hasDepartment]
  );

  const totalRows = useMemo(() => [totals], [totals]);

  const currentStoreRowStyles = useMemo(() => [
    {
      when: (row) => row.id === user?.store_id,
      style: {
        backgroundColor: "info.light",
        fontWeight: 500,
      },
    },
  ], [user?.store_id]);

  return (
    <>
      <CustomSpinner isLoading={loading} />
      <Box className="card">
        <PageHeader title={isStoreType ? "Tiendas" : "Almacenes"} childrenMd={6}>
          <Box sx={{
            display: "flex", alignItems: "center", gap: 1,
            flexWrap: "wrap", justifyContent: { xs: "flex-start", md: "flex-end" },
          }}>
            {tenantInfo.notices?.length > 0 && (
              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                {tenantInfo.notices.map((notice, index) => (
                  <Chip
                    key={index}
                    label={notice.notice}
                    color={NOTICE_COLORS[notice.variant] || "success"}
                    size="small"
                  />
                ))}
              </Box>
            )}
            {isOwner && (
              <CustomButton
                onClick={() => createStoreModal.open()}
                startIcon={<AddBusinessIcon />}
                disabled={createStoreBlocked}
                title={createStoreBlocked ? "Has alcanzado el límite de tiendas de tu plan" : ""}
                fullWidth={isMobile}
              >
                Crear tienda
              </CustomButton>
            )}
          </Box>
        </PageHeader>

        <StoreKpiTiles tenantInfo={tenantInfo} totals={totals} />

        <StoreListFilters
          params={params}
          departments={departments}
          onChange={handleParams}
          onStoreTypeChange={handleStoreType}
        />

        <StoreQuickFilters
          storeType={params.store_type}
          stores={stores}
          value={quickFilter}
          onChange={setQuickFilter}
        />

        <Box sx={{ mb: 2 }}>
          {isMobile ? (
            <CardGallery
              items={filteredStores}
              loading={loading}
              gridItem={{ xs: 12, sm: 6 }}
              emptyText={isOwner ? "Crea tu primera tienda para empezar" : "No hay sucursales registradas"}
              renderItem={(store) => (
                <StoreCard
                  store={store}
                  quickFilter={quickFilter}
                  isStoreType={isStoreType}
                  averageSales={averageSales}
                  enterTooltip={isStoreType ? "Entrar a la tienda" : "Entrar al almacén"}
                  {...sharedProps}
                />
              )}
            />
          ) : (
            <DataTable
              progressPending={loading}
              noDataComponent={isOwner ? (
                <Box sx={{ py: 6, textAlign: "center" }}>
                  <CustomButton
                    onClick={() => createStoreModal.open()}
                    disabled={createStoreBlocked}
                    startIcon={<AddBusinessIcon />}
                    sx={firstStoreButtonSx}
                  >
                    Crear mi primera tienda
                  </CustomButton>
                </Box>
              ) : "No hay sucursales registradas"}
              data={filteredStores}
              columns={columns}
              conditionalRowStyles={currentStoreRowStyles}
            />
          )}
        </Box>

        {!isMobile && isStoreType && stores.length > 1 && !FILTERS_WITHOUT_TOTALS.includes(quickFilter) && (
          <Box sx={{ mt: 4 }}>
            <Box sx={{ mb: 2 }}>
              <h2>Totales</h2>
            </Box>
            <DataTable
              progressPending={loading}
              data={totalRows}
              columns={totalColumns}
            />
          </Box>
        )}
      </Box>

      <UserManagementModals management={userManagement} />

      <StorePaymentModal isOpen={mpModal.isOpen} onClose={mpModal.close} />

      <CreateStoreModal
        isOpen={createStoreModal.isOpen}
        onClose={createStoreModal.close}
        onCreated={() => {
          refetchCanCreate();
          window.location.reload();
        }}
      />
    </>
  );
};

export default StoreList;
