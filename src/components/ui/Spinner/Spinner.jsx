import { memo } from "react";
import { LinearProgress, Box } from '@mui/material';

export const CustomSpinner = memo(({isLoading}) => {
  if (!isLoading) return null;

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
      <Box sx={{ textAlign: 'center' }}>
        <LinearProgress />
      </Box>
    </Box>
  );
});
