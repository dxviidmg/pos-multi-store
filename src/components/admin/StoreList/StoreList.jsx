import { useEffect, useCallback, useMemo, useRef, useState } from "react";
import { Button, Box, useMediaQuery, useTheme } from "@mui/material";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import CardGallery from "../../ui/CardGallery/CardGallery";
import DataTable from "../../ui/DataTable/DataTable";
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
import { getStoreColumns, getStorageColumns } from "./StoreList.columns";
import CreateStoreModal from "./CreateStoreModal";
import StoreCard from "./StoreCard";
import StoreEmptyNotice from "./StoreEmptyNotice";
import StoreHeader from "./StoreHeader";
import StoreKpiTiles from "./StoreKpiTiles";
import StorePeriodFilters from "./StorePeriodFilters";
import StoreQuickFilters from "./StoreQuickFilters";
import StoreTypeTabs from "./StoreTypeTabs";
import StorePaymentModal from "./StorePaymentModal";
import { getGreeting, getPeriodRange } from "./storeInsights";
import { resetStoreWithConfirm } from "./resetStoreDialog";
import { useModal } from "../../../hooks/useModal";
import { useCanCreateStore } from "../../../hooks/useCanCreateStore";
import { showRequestError } from "../../../utils/alerts";

// La tabla y sus pastillas de vista comparten una misma tarjeta con borde
const TABLE_CARD_SX = {
  border: "1px solid", borderColor: "divider", borderRadius: "14px", overflow: "hidden", bgcolor: "background.paper",
  "& > div:last-of-type": { mt: 0 },
  "& .MuiDataGrid-root": { border: 0, borderRadius: 0 },
  "& .MuiDataGrid-cell": { borderColor: "rowDivider.main", fontVariantNumeric: "tabular-nums" },
};

const StoreList = () => {
  const { user } = useUser();
  const isOwner = isOwnerUser(user);
  const { switchStore } = useSwitchStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [storeInvestments, setStoreInvestments] = useState({});
  const [quickFilter, setQuickFilter] = useState("all");
  const [period, setPeriod] = useState("today");
  // Al cambiar de pestaña se conserva el alto del contenido mientras carga, para que el scroll no salte
  const contentRef = useRef(null);
  const [lockedHeight, setLockedHeight] = useState(0);
  const [params, setParams] = useState(() => ({ ...getPeriodRange("today"), store_type: STORE_TYPES.STORE }));
  const hasDepartment = Boolean(params.department_id);
  const isStoreType = params.store_type === STORE_TYPES.STORE;

  const userManagement = useUserManagement();
  const { handleOpenEditUser, handleOpenChangePassword } = userManagement;

  const { data: storesData, isLoading: loadingStores } = useStores(params);
  const { data: tenantInfo = {}, isLoading: loadingTenant } = useTenantInfo();
  const { data: departments = [] } = useDepartments();

  const mpModal = useModal();
  const createStoreModal = useModal();
  const { open: openCreateStore } = createStoreModal;
  const { data: canCreateData, refetch: refetchCanCreate } = useCanCreateStore();
  const createStoreBlocked = Boolean(canCreateData && !canCreateData.can_create);

  const { open: openMpModal } = mpModal;
  useEffect(() => {
    if (tenantInfo.show_mp_modal) openMpModal();
  }, [tenantInfo.show_mp_modal, openMpModal]);

  const { store_type: storeType } = params;
  useEffect(() => {
    if (!loadingStores) setLockedHeight(0);
  }, [loadingStores, storeType]);

  const stores = useMemo(() => storesData?.stores || [], [storesData]);
  const totals = useMemo(() => storesData?.totals || {}, [storesData]);
  const loading = loadingStores || loadingTenant;

  const handleParams = useCallback((e) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handlePeriod = useCallback((key) => {
    setPeriod(key);
    if (key !== "custom") setParams((prev) => ({ ...prev, ...getPeriodRange(key) }));
  }, []);

  const handleStoreType = useCallback((storeType) => {
    setLockedHeight(contentRef.current?.offsetHeight || 0);
    setQuickFilter("all");
    setParams((prev) => ({ ...prev, store_type: storeType }));
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

  const filteredStores = useMemo(
    () => (quickFilter === "synced" ? stores.filter((store) => !store.has_all_products) : stores),
    [stores, quickFilter]
  );


  const sharedProps = useMemo(() => ({
    user,
    storeInvestments,
    handleSelectStore: switchStore,
    handleOpenEditUser,
    handleOpenChangePassword,
    handleShowInvestmentForStore,
    handleResetStore: resetStoreWithConfirm,
  }), [
    user,
    storeInvestments,
    switchStore,
    handleOpenEditUser,
    handleOpenChangePassword,
    handleShowInvestmentForStore,
  ]);

  const columns = useMemo(() => (
    isStoreType
      ? getStoreColumns({ ...sharedProps, quickFilter, hasDepartment })
      : getStorageColumns({ ...sharedProps, quickFilter })
  ), [isStoreType, sharedProps, quickFilter, hasDepartment]);

  const currentStoreRowStyles = useMemo(() => [
    {
      when: (row) => row.id === user?.store_id,
      style: {
        backgroundColor: "info.light",
        fontWeight: 500,
      },
    },
  ], [user?.store_id]);

  const emptyList = isStoreType ? (
    <StoreEmptyNotice
      icon={StorefrontOutlinedIcon}
      title={isOwner ? "Aún no tienes tiendas" : "No hay tiendas registradas"}
      description={isOwner ? "Crea la primera para empezar a vender." : undefined}
      action={isOwner && (
        <Button variant="contained" onClick={() => openCreateStore()} disabled={createStoreBlocked}>Crear mi primera tienda</Button>
      )}
    />
  ) : (
    <StoreEmptyNotice icon={StorefrontOutlinedIcon} title="Todavía no tienes almacenes" />
  );

  const quickFilters = (
    <StoreQuickFilters
      storeType={params.store_type}
      stores={stores}
      value={quickFilter}
      onChange={setQuickFilter}
    />
  );

  return (
    <>
      <Box className="card">
        <StoreHeader
          title={isStoreType ? "Tiendas" : "Almacenes"}
          greeting={getGreeting(user)}
          notices={tenantInfo.notices}
          isOwner={isOwner}
          createBlocked={createStoreBlocked}
          onCreate={() => openCreateStore()}
        />

        <StorePeriodFilters
          period={period}
          onPeriodChange={handlePeriod}
          params={params}
          departments={departments}
          onChange={handleParams}
          showFilters={isStoreType}
        />

        <StoreKpiTiles tenantInfo={tenantInfo} totals={totals} period={period} loading={loading} />

        <StoreTypeTabs value={params.store_type} onChange={handleStoreType} />

        <Box ref={contentRef} sx={{ minHeight: lockedHeight || undefined }}>
          <Box key={params.store_type} className="fade-in-up">
            {isMobile ? (
              <>
                {quickFilters}
                <Box sx={{ mt: 2 }}>
                  <CardGallery
                    items={filteredStores}
                    loading={loading}
                    gridItem={{ xs: 12, sm: 6 }}
                    emptyText={isOwner ? "Crea tu primera tienda para empezar" : "No hay sucursales registradas"}
                    renderItem={(store) => (
                      <StoreCard store={store} quickFilter={quickFilter} {...sharedProps} />
                    )}
                  />
                </Box>
              </>
            ) : (
              <Box sx={TABLE_CARD_SX}>
                {quickFilters}
                <DataTable
                  progressPending={loading}
                  noDataComponent={emptyList}
                  data={filteredStores}
                  columns={columns}
                  conditionalRowStyles={currentStoreRowStyles}
                />
              </Box>
            )}
          </Box>
        </Box>
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
