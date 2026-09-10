import { Grid, Typography } from "@mui/material";

const PageHeader = ({ title, children, childrenMd = 3 }) => (
  <Grid container alignItems="center" sx={{ mb: 2 }}>
    <Grid item xs={12} md>
      <Typography variant="h3" component="h1">{title}</Typography>
    </Grid>
    {children && (
      <Grid item xs={12} md={childrenMd}>
        {children}
      </Grid>
    )}
  </Grid>
);

export default PageHeader;
