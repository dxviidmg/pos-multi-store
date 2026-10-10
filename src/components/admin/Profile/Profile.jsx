import React, { useState, useEffect } from "react";
import { Alert, Grid } from "@mui/material";
import { useUser } from "../../../context/UserContext";
import { isOwner } from "../../../constants/routeAccess";
import { getTenant } from "../../../api/tenants";
import { getUser } from "../../../api/users";
import { logger } from "../../../utils/logger";
import { PageSkeleton } from "../../ui/Skeleton/Skeleton";
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
    const fetchData = async () => {
      try {
        const [tenantResponse, userResponse] = await Promise.all([getTenant(user.tenant_id), getUser(user.user_id)]);
        setTenant(tenantResponse.data);
        setUserInfo(userResponse.data);
      } catch (error) {
        logger.error("Profile fetch error:", error);
        setLoadFailed(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.tenant_id, user.user_id]);

  if (loading) return <PageSkeleton />;

  return (
    <Grid container>
      <Grid item xs={12} className="card">
        {loadFailed && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Error al cargar los datos
          </Alert>
        )}

        <Grid container spacing={3}>
          {isOwner(user) && <TenantSection tenantId={user.tenant_id} tenant={tenant || {}} />}
          <UserSection userId={user.user_id} initialUser={userInfo || {}} />
          <PasswordSection userId={user.user_id} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Profile;
