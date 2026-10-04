import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Alert, AlertTitle } from "@mui/material";
import { useUser } from "../../context/UserContext";
import {
  canAccessRoute,
  getHomeRoute,
  isSalesDashboardRestricted,
  normalizePath,
  SALES_DASHBOARD_PATH,
} from "../../constants/routeAccess";

/**
 * Guard de rutas: solo deja pasar a las páginas que el rol, el tipo de sucursal
 * y el plan del usuario permiten (ver constants/routeAccess.js). Si no tiene
 * acceso, lo manda a su página inicial.
 */
const RequireAccess = () => {
  const { user } = useUser();
  const { pathname } = useLocation();

  if (!canAccessRoute(user, pathname)) {
    return <Navigate to={getHomeRoute(user)} replace />;
  }

  if (normalizePath(pathname) === SALES_DASHBOARD_PATH && isSalesDashboardRestricted(user)) {
    return (
      <Alert severity="warning" sx={{ borderRadius: 2 }}>
        <AlertTitle>Tablero no disponible en este horario</AlertTitle>
        El tablero de ventas exitosas solo se puede consultar antes de las 10:00 a. m. y después de las 9:00 p. m.
      </Alert>
    );
  }

  return <Outlet />;
};

export default RequireAccess;
