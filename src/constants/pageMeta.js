// Ícono y descripción corta de cada página, para el encabezado (PageHeader).
// La ayuda larga sigue en helpTexts.js.
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import TransformOutlinedIcon from "@mui/icons-material/TransformOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import PolicyOutlinedIcon from "@mui/icons-material/PolicyOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import MiscellaneousServicesOutlinedIcon from "@mui/icons-material/MiscellaneousServicesOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import AssignmentReturnOutlinedIcon from "@mui/icons-material/AssignmentReturnOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import SyncOutlinedIcon from "@mui/icons-material/SyncOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

const pageMeta = {
  "/tiendas/": { icon: StoreOutlinedIcon, description: "Pagos, ventas e inventario de cada sucursal." },
  "/ventas/": { icon: ReceiptLongOutlinedIcon, description: "Consulta, reimprime y gestiona las ventas registradas." },
  "/apartados/": { icon: BookmarkAddedOutlinedIcon, description: "Ventas apartadas con saldo pendiente." },
  "/vender/": { icon: ShoppingCartOutlinedIcon, description: "Busca productos, arma el carrito y cobra." },
  "/distribuir/": { icon: LocalShippingOutlinedIcon, description: "Prepara envíos de mercancía a tus tiendas." },
  "/importar-ventas/": { icon: UploadFileOutlinedIcon, description: "Carga ventas en lote desde un archivo de Excel." },
  "/corte-caja/": { icon: PointOfSaleOutlinedIcon, description: "Resumen del día por método de pago para cuadrar tu caja." },
  "/movimientos-caja/": { icon: SwapVertOutlinedIcon, description: "Entradas y salidas de efectivo que no son ventas." },
  "/distribuciones/": { icon: LocalShippingOutlinedIcon, description: "Envíos de mercancía del almacén a las tiendas." },
  "/conversiones/": { icon: TransformOutlinedIcon, description: "Convierte productos entre presentaciones." },
  "/traspasos/": { icon: SwapHorizOutlinedIcon, description: "Movimientos de mercancía entre sucursales." },
  "/solicitudes-ajustes-stock/": { icon: FactCheckOutlinedIcon, description: "Ajustes de inventario pendientes de revisar." },
  "/historial-precios/": { icon: PriceChangeOutlinedIcon, description: "Cambios de precio registrados por producto." },
  "/clientes/": { icon: PeopleAltOutlinedIcon, description: "Tu cartera de clientes, sus datos y descuentos." },
  "/productos/": { icon: Inventory2OutlinedIcon, description: "Catálogo compartido entre todas tus tiendas." },
  "/inventario/": { icon: WarehouseOutlinedIcon, description: "Existencias disponibles en esta sucursal." },
  "/auditoria-inventario/": { icon: PolicyOutlinedIcon, description: "Productos pendientes de verificar en el conteo." },
  "/marcas/": { icon: LocalOfferOutlinedIcon, description: "Marcas para organizar y buscar tus productos." },
  "/departamentos/": { icon: CategoryOutlinedIcon, description: "Departamentos para agrupar tu catálogo." },
  "/historial-stock/": { icon: HistoryOutlinedIcon, description: "Cada movimiento de existencias, con fecha y usuario." },
  "/pagos/": { icon: CreditCardOutlinedIcon, description: "Historial de pagos de tu suscripción." },
  "/suscripciones/": { icon: AutorenewOutlinedIcon, description: "Suscripciones registradas en tu cuenta." },
  "/mi-plan-actual/": { icon: WorkspacePremiumOutlinedIcon, description: "Tu plan, sus límites y tu método de pago." },
  "/vendedores/": { icon: BadgeOutlinedIcon, description: "Personal de venta de tus tiendas." },
  "/servicios/": { icon: MiscellaneousServicesOutlinedIcon, description: "Servicios adicionales para tu negocio." },
  "/tablero-ventas/": { icon: InsightsOutlinedIcon, description: "Tendencias de venta por periodo y sucursal." },
  "/tablero-ventas-ajustadas-cancelaciones/": { icon: AssignmentReturnOutlinedIcon, description: "Ventas ajustadas y canceladas del periodo." },
  "/tablero-verificacion-stock/": { icon: ChecklistOutlinedIcon, description: "Avance de la verificación de inventario." },
  "/tablero-traspasos-pendientes/": { icon: PendingActionsOutlinedIcon, description: "Traspasos que todavía no se reciben." },
  "/tablero-productos/": { icon: LeaderboardOutlinedIcon, description: "Desempeño de tus productos." },
  "/reasignacion/": { icon: DriveFileMoveOutlinedIcon, description: "Cambia marca o departamento de varios productos a la vez." },
  "/importar-productos/": { icon: UploadFileOutlinedIcon, description: "Da de alta tu catálogo desde un archivo de Excel." },
  "/importar-inventario/": { icon: UploadFileOutlinedIcon, description: "Carga existencias de una tienda desde Excel." },
  "/auditoria-transacciones/": { icon: ManageSearchOutlinedIcon, description: "Revisión de transacciones registradas." },
  "/auditoria-productos/": { icon: ManageSearchOutlinedIcon, description: "Revisión de cambios en productos." },
  "/sincronizar/": { icon: SyncOutlinedIcon, description: "Sincroniza los datos de tus tiendas." },
  "/perfil/": { icon: AccountCircleOutlinedIcon, description: "Tus datos, tu negocio y tu contraseña." },
};

export default pageMeta;
