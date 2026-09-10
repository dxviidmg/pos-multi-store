import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export const chooseIcon = (condition) => {
  if (condition) {
    return <CheckCircleIcon sx={{ color: "green" }} />;
  }
  return <CancelIcon sx={{ color: "red" }} />;
};
