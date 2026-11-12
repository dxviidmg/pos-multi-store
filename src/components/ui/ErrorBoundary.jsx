import { Component } from "react";
import { Box, Typography, Button } from "@mui/material";
import { logger } from "../../utils/logger";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logger.error("Error al renderizar la página:", error, info?.componentStack);
  }

  handleReload = () => window.location.reload();

  render() {
    if (this.state.hasError) {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh" gap={2}>
          <Typography variant="h6">Algo salió mal al cargar esta página.</Typography>
          <Button variant="contained" onClick={this.handleReload}>Recargar</Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
