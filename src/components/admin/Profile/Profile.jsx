import React, { useState, useEffect } from "react";
import { Alert, Box, Grid } from "@mui/material";
import { useUser } from "../../../context/UserContext";
import { getRole, isOwner } from "../../../constants/routeAccess";
import { getTenant } from "../../../api/tenants";
import { getUser } from "../../../api/users";
import { logger } from "../../../utils/logger";
import { PageSkeleton } from "../../ui/Skeleton/Skeleton";
import ProfileHero from "./ProfileHero";
import TenantSection from "./TenantSection";
import UserSection from "./UserSection";
import PasswordSection from "./PasswordSection";

const Profile = () => {
  const { user } = useUser();
  const [tenant, setTenant] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      try {
        const [tenantResponse, userResponse] = await Promise.all([getTenant(user.tenant_id), getUser(user.user_id)]);
        if (ignore) return;
        setTenant(tenantResponse.data);
        setUserInfo(userResponse.data);
      } catch (error) {
        logger.error("Profile fetch error:", error);
        if (!ignore) setLoadFailed(true);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchData();
    return () => { ignore = true; };
  }, [user.tenant_id, user.user_id]);

  if (loading) return <PageSkeleton />;

  return (
    <Box>
      {loadFailed && (
        <Alert severity="error" variant="filled" sx={{ mb: 2 }}>
          Error al cargar los datos
        </Alert>
      )}

      <ProfileHero userInfo={userInfo || {}} role={getRole(user)} tenant={tenant || {}} />

      <Grid container spacing={2}>
        {isOwner(user) && <TenantSection tenantId={user.tenant_id} tenant={tenant || {}} />}
        <UserSection userId={user.user_id} initialUser={userInfo || {}} />
        <PasswordSection userId={user.user_id} />
      </Grid>
    </Box>
  );
};

export default Profile;
