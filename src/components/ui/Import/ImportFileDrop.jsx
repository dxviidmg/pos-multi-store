import React from "react";
import { Chip, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DropZone from "../DropZone";
import VisuallyHiddenInput from "../VisuallyHiddenInput";

/** Zona para arrastrar o elegir el archivo; usa `dropZoneProps`, `fileInputRef` y `handleDataChange` de `useImportFlow`. */
const ImportFileDrop = ({ dropZoneProps, file, fileInputRef, onChange }) => (
  <DropZone {...dropZoneProps}>
    <CloudUploadIcon sx={{ fontSize: 32, color: "text.secondary", mb: 0.5 }} />
    <Typography variant="body2" color="text.secondary">
      Arrastra tu archivo o haz clic para seleccionar
    </Typography>
    {file && <Chip label={file.name} color="primary" size="small" sx={{ mt: 1 }} />}
    <VisuallyHiddenInput type="file" ref={fileInputRef} onChange={onChange} name="file" />
  </DropZone>
);

export default ImportFileDrop;
