import { memo } from "react";
import { LinearProgress, Box } from '@mui/material';

export const CustomSpinner = memo(({isLoading}) => {
  if (!isLoading) return null;

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 9999 }}>
      <LinearProgress />
    </Box>
  );
});
