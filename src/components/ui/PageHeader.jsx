import { Stack } from "@mui/material";

const PageHeader = ({ title, children }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
    <h1>{title}</h1>
    {children && <Stack direction="row" spacing={1}>{children}</Stack>}
  </Stack>
);

export default PageHeader;
