import React, { useState } from "react";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { createDiscount } from "../../../api/discounts";
import { showSuccess, showError } from "../../../utils/alerts";
import { TextField, Box } from "@mui/material";
import DiscountIcon from "@mui/icons-material/Discount";
import { useQueryClient } from "@tanstack/react-query";

const DiscountModal = ({ isOpen, onClose }) => {
  const [discountPercentage, setDiscountPercentage] = useState("");
  const queryClient = useQueryClient();

  const handleSave = async () => {
    const response = await createDiscount({ discount_percentage: discountPercentage });

    if (response.status === 201) {
      setDiscountPercentage("");
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      showSuccess("Descuento creado");
      onClose();
    } else {
      let message = "Error desconocido, por favor comuníquese con soporte";
      if (response.response?.status === 400 && response.response.data.discount_percentage) {
        const err = response.response.data.discount_percentage[0];
        if (err === "discount with this discount percentage already exists.") {
          message = "El descuento ya existe";
        }
      }
      showError("Error al crear descuento", message);
    }
  };

  return (
    <CustomModal showOut={isOpen} onClose={onClose} title="Crear descuento">
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          size="small"
          fullWidth
          label="Porcentaje de descuento"
          type="number"
          value={discountPercentage}
          onChange={(e) => setDiscountPercentage(e.target.value)}
        />
        <CustomButton onClick={handleSave} disabled={!discountPercentage} startIcon={<DiscountIcon />}>
          Crear descuento
        </CustomButton>
      </Box>
    </CustomModal>
  );
};

export default DiscountModal;
