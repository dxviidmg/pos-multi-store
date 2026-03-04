#!/bin/bash

# Script para actualizar imports después de reorganización

cd /home/david/pos-multi-store/src

# Actualizar imports de commons a ui
find . -type f \( -name "*.js" -o -name "*.jsx" \) -exec sed -i \
  -e 's|from "\.\./commons/customTable/CustomTable"|from "../ui/Table/Table"|g' \
  -e 's|from "\.\./commons/customButton/CustomButton"|from "../ui/Button/Button"|g' \
  -e 's|from "\.\./commons/customModal/CustomModal"|from "../ui/Modal/Modal"|g' \
  -e 's|from "\.\./commons/customSpinner/CustomSpinner"|from "../ui/Spinner/Spinner"|g' \
  -e 's|from "\.\./commons/Tooltip"|from "../ui/Tooltip"|g' \
  -e 's|from "\.\./commons/icons/Icons"|from "../ui/icons/Icons"|g' \
  {} +

# Actualizar imports de componentes movidos (nivel 1 - mismo dominio)
find . -type f \( -name "*.js" -o -name "*.jsx" \) -exec sed -i \
  -e 's|from "\.\./paymentModal/PaymentModal"|from "./PaymentModal/PaymentModal"|g' \
  -e 's|from "\.\./brandModal/BrandModal"|from "./BrandModal/BrandModal"|g' \
  -e 's|from "\.\./sellerModal/SellerModal"|from "./SellerModal/SellerModal"|g' \
  -e 's|from "\.\./cashFlowModal/CashFlowModal"|from "./CashFlowModal/CashFlowModal"|g' \
  -e 's|from "\.\./productModal/ProductModal"|from "./ProductModal/ProductModal"|g' \
  {} +

# Actualizar imports de componentes movidos (nivel 2 - entre dominios)
find . -type f \( -name "*.js" -o -name "*.jsx" \) -exec sed -i \
  -e 's|from "\.\./searchProduct/SearchProduct"|from "../products/SearchProduct/SearchProduct"|g' \
  -e 's|from "\.\./cart/MultiCart"|from "../inventory/cart/MultiCart"|g' \
  {} +

echo "Imports actualizados"
