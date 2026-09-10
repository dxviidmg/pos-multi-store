'use client';

import { useEffect } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Registrar el error para diagnóstico.
    console.error(error);
  }, [error]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      gap={2}
    >
      <Typography variant="h6">Algo salió mal al cargar esta página.</Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={() => reset()}>
          Reintentar
        </Button>
        <Button variant="outlined" onClick={() => window.location.reload()}>
          Recargar
        </Button>
      </Stack>
    </Box>
  );
}
