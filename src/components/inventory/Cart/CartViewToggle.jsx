import React, { memo } from "react";
import { IconButton, Tooltip } from "@mui/material";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";

const OPTIONS = [
  { value: "table", title: "Vista de tabla", Icon: ViewAgendaIcon },
  { value: "cards", title: "Vista de cards", Icon: ViewWeekIcon },
];

/**
 * Botones para alternar el carrito entre tabla y tarjetas.
 */
const CartViewToggle = ({ value, onChange }) => (
  <>
    {OPTIONS.map(({ value: option, title, Icon }) => {
      const active = value === option;
      return (
        <Tooltip key={option} title={title}>
          <IconButton
            onClick={() => onChange(option)}
            size="small"
            aria-pressed={active}
            sx={{
              bgcolor: active ? 'primary.main' : 'transparent',
              color: active ? 'white' : 'text.primary',
              border: '1px solid',
              borderColor: active ? 'primary.main' : 'divider',
              '&:hover': { bgcolor: active ? 'primary.dark' : 'action.hover' },
            }}
          >
            <Icon fontSize="small" />
          </IconButton>
        </Tooltip>
      );
    })}
  </>
);

export default memo(CartViewToggle);
