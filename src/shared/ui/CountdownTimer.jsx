import { Typography } from "@mui/material";

const CountdownTimer = ({ seconds }) => {
  if (!seconds) return null;
  return (
    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
      Siguiente consulta en {seconds}s
    </Typography>
  );
};

export default CountdownTimer;
