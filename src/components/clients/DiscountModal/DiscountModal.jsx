import React, { useState } from "react";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { createDiscount } from "../../../api/discounts";
import { showSuccess, showRequestError, showWarning } from "../../../utils/alerts";
import { TextField, Box } from "@mui/material";
import DiscountIcon from "@mui/icons-material/Discount";
import { useQueryClient } from "@tanstack/react-query";

const DiscountModal = ({ isOpen, onClose }) => {
  const [discountPercentage, setDiscountPercentage] = useState("");
  const queryClient = useQueryClient();

  const handleSave = async () => {
    try {
      await createDiscount({ discount_percentage: discountPercentage });
      setDiscountPercentage("");
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      showSuccess("Descuento creado");
      onClose();
    } catch (error) {
      const err = error.response?.status === 400 && error.response.data?.discount_percentage?.[0];
      if (err === "discount with this discount percentage already exists.") {
        showWarning("No se pudo crear el descuento", "Ese descuento ya existe.");
      } else {
        showRequestError("crear el descuento", error);
      }
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
