import React, { useState } from "react";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { createDiscount } from "../../../api/discounts";
import { useCrudMutation } from "../../../hooks/useCrudMutation";
import { TextField, Box } from "@mui/material";
import DiscountIcon from "@mui/icons-material/Discount";

const DUPLICATE_DISCOUNT_ERROR = "discount with this discount percentage already exists.";

const discountErrorParser = (error) =>
  error.response?.status === 400 &&
  error.response.data?.discount_percentage?.[0] === DUPLICATE_DISCOUNT_ERROR
    ? "Ese descuento ya existe."
    : null;

const DiscountModal = ({ isOpen, onClose }) => {
  const [discountPercentage, setDiscountPercentage] = useState("");
  const createMutation = useCrudMutation(createDiscount, {
    queryKey: "discounts",
    successMessage: "Descuento creado",
    errorAction: "crear el descuento",
    errorParser: discountErrorParser,
  });

  const handleSave = () => {
    createMutation.mutate(
      { discount_percentage: discountPercentage },
      {
        onSuccess: () => {
          setDiscountPercentage("");
          onClose();
        },
      }
    );
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
        <CustomButton
          onClick={handleSave}
          disabled={!discountPercentage || createMutation.isPending}
          startIcon={<DiscountIcon />}
        >
          Crear descuento
        </CustomButton>
      </Box>
    </CustomModal>
  );
};

export default DiscountModal;
