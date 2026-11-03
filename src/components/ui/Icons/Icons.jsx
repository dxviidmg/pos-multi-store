import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export const chooseIcon = (condition) => {
  if (condition) {
    return <CheckCircleIcon sx={{ color: "success.main" }} />;
  }
  return <CancelIcon sx={{ color: "error.main" }} />;
};
