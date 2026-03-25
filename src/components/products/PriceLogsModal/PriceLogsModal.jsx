import React, { useEffect, useState, useMemo } from "react";
import CustomModal from "../../ui/Modal/Modal";
import DataTable from "../../ui/DataTable/DataTable";
import { getProductPriceLogs } from "../../../api/products";
import { getFormattedDateTime } from "../../../utils/utils";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { Grid } from "@mui/material";

const PriceLogsModal = ({ isOpen, product, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product?.id && isOpen) {
      setLoading(true);
      getProductPriceLogs(product.id).then((res) => {
        setLogs(res.data);
        setLoading(false);
      });
    }
  }, [product, isOpen]);

  const rows = useMemo(() => {
    const map = {};
    logs.forEach((log) => {
      const key = log.created_at.slice(0, 16);
      if (!map[key]) map[key] = { id: key, date: log.created_at, user: log.user_username };
      map[key][log.field] = `${log.previous_value} → ${log.new_value}`;
    });
    return Object.values(map);
  }, [logs]);

  const fields = useMemo(() => {
    const seen = {};
    logs.forEach((l) => { seen[l.field] = l.field_display; });
    return Object.entries(seen);
  }, [logs]);

  return (
    <CustomModal showOut={isOpen} onClose={onClose} title={`Historial de precios — ${product?.name || ""}`}>
      <Grid container sx={{ padding: '1rem', backgroundColor: 'rgba(4, 53, 107, 0.2)' }}>
        <Grid item xs={12} className="card">
          <CustomSpinner isLoading={loading} />
          <DataTable
            data={rows}
            columns={[
              { name: "Fecha", selector: (row) => getFormattedDateTime(row.date), minWidth: 150 },
              ...fields.map(([field, display]) => ({
                name: display,
                selector: (row) => row[field] || "-",
              })),
              { name: "Usuario", selector: (row) => row.user },
            ]}
          />
        </Grid>
      </Grid>
    </CustomModal>
  );
};

export default PriceLogsModal;
