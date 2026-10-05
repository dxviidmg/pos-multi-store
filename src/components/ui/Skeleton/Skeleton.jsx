import { memo } from "react";
import { Box, Skeleton, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";

const ROW_WIDTHS = ["92%", "78%", "86%", "70%", "88%", "74%", "82%", "66%"];

export const TableSkeleton = memo(({ rows = 6, columns = 5 }) => (
  <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1.5, overflow: "hidden" }}>
    <Box sx={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 2, px: 2, py: 1.25, bgcolor: "primary.main" }}>
      {Array.from({ length: columns }, (_, i) => (
        <Skeleton key={i} variant="text" sx={{ bgcolor: (theme) => alpha(theme.palette.common.white, 0.18), mx: "auto", width: "60%" }} />
      ))}
    </Box>
    {Array.from({ length: rows }, (_, r) => (
      <Box
        key={r}
        sx={{
          display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 2, px: 2, py: 1.1,
          borderTop: r ? "1px solid" : "none", borderColor: "divider",
        }}
      >
        {Array.from({ length: columns }, (_, c) => (
          <Skeleton key={c} variant="text" sx={{ mx: "auto", width: ROW_WIDTHS[(r + c) % ROW_WIDTHS.length] }} />
        ))}
      </Box>
    ))}
  </Box>
));

export const PageSkeleton = memo(() => (
  <Box className="fade-in-up" aria-busy="true" aria-label="Cargando">
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
      <Skeleton variant="text" sx={{ fontSize: "1.5rem", width: 220 }} />
      <Skeleton variant="rounded" width={140} height={32} />
    </Stack>
    <Box className="card">
      <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
        <Skeleton variant="rounded" height={36} sx={{ flex: 2 }} />
        <Skeleton variant="rounded" height={36} sx={{ flex: 1 }} />
        <Skeleton variant="rounded" height={36} sx={{ flex: 1, display: { xs: "none", sm: "block" } }} />
      </Stack>
      <TableSkeleton />
    </Box>
  </Box>
));
