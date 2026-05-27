import { Grid } from "@mui/material";

const PageHeader = ({ title, children, childrenMd = 3 }) => (
  <Grid container alignItems="center" sx={{ mb: 2 }}>
    <Grid item xs>
      <h1>{title}</h1>
    </Grid>
    {children && (
      <Grid item xs={12} md={childrenMd}>
        {children}
      </Grid>
    )}
  </Grid>
);

export default PageHeader;
