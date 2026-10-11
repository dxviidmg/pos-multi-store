import { Chip } from "@mui/material";

const StatusChip = ({ status }) => (
  <Chip
    size="small"
    label={status}
    color={status === "Exitoso" ? "success" : "error"}
  />
);

export default StatusChip;
