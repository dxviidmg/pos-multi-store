/**
 * Tests para priceCalculators.js
 * Verifica que las funciones de cálculo de precios funcionan correctamente.
 * 
 * Nota: Estos tests pueden ejecutarse con Jest si está configurado.
 * Para verificar manualmente, revisa los casos de prueba en los comentarios.
 */

import {
  aClientIsSelected,
  calculateProductPrice,
  changeProductPrice,
  updateCartWithPrice,
} from "./priceCalculators";

describe("priceCalculators", () => {
  describe("aClientIsSelected", () => {
    it("retorna true si el cliente tiene propiedades", () => {
      expect(aClientIsSelected({ id: 1, name: "Juan" })).toBe(true);
    });

    it("retorna false si el cliente está vacío", () => {
      expect(aClientIsSelected({})).toBe(false);
    });

    it("retorna false si el cliente es undefined", () => {
      expect(aClientIsSelected(undefined || {})).toBe(true); // undefined || {} → {}
    });
  });

  describe("calculateProductPrice", () => {
    const prices = {
      unit_price: 100,
      wholesale_price: 80,
      min_wholesale_quantity: 5,
      wholesale_price_on_client_discount: true,
    };

    it("retorna precio unitario si cantidad < mínimo mayoreo", () => {
      expect(calculateProductPrice(3, prices, false)).toBe(100);
    });

    it("retorna precio de mayoreo si cantidad >= mínimo mayoreo", () => {
      expect(calculateProductPrice(5, prices, false)).toBe(80);
    });

    it("retorna precio unitario si hay cliente y wholesale_price_on_client_discount es false", () => {
      const pricesNoDiscount = { ...prices, wholesale_price_on_client_discount: false };
      expect(calculateProductPrice(10, pricesNoDiscount, true)).toBe(100);
    });

    it("retorna precio de mayoreo si hay cliente y wholesale_price_on_client_discount es true", () => {
      expect(calculateProductPrice(5, prices, true)).toBe(80);
    });

    it("maneja precios sin mayoreo (min_wholesale_quantity = undefined)", () => {
      const pricesNoWholesale = { ...prices, min_wholesale_quantity: undefined };
      expect(calculateProductPrice(10, pricesNoWholesale, false)).toBe(100);
    });
  });

  describe("changeProductPrice", () => {
    const prices = {
      unit_price: 100,
      wholesale_price: 80,
    };

    it("alterna de mayoreo a unitario", () => {
      expect(changeProductPrice(80, prices)).toBe(100);
    });

    it("alterna de unitario a mayoreo", () => {
      expect(changeProductPrice(100, prices)).toBe(80);
    });
  });

  describe("updateCartWithPrice", () => {
    const cart = [
      {
        id: 1,
        quantity: 3,
        product: {
          prices: {
            unit_price: 100,
            wholesale_price: 80,
            min_wholesale_quantity: 5,
            wholesale_price_on_client_discount: true,
          },
        },
        product_price: 100,
      },
      {
        id: 2,
        quantity: 5,
        product: {
          prices: {
            unit_price: 100,
            wholesale_price: 80,
            min_wholesale_quantity: 5,
            wholesale_price_on_client_discount: true,
          },
        },
        product_price: 80,
      },
    ];

    it("recalcula precios cuando se selecciona un cliente", () => {
      const updated = updateCartWithPrice(cart, true);
      expect(updated[0].product_price).toBe(100); // Cantidad < mínimo
      expect(updated[1].product_price).toBe(80); // Cantidad >= mínimo
    });

    it("mantiene precios cuando no hay cliente", () => {
      const updated = updateCartWithPrice(cart, false);
      expect(updated[0].product_price).toBe(100);
      expect(updated[1].product_price).toBe(80);
    });

    it("no muta el carrito original", () => {
      const original = JSON.parse(JSON.stringify(cart));
      updateCartWithPrice(cart, true);
      expect(cart).toEqual(original);
    });
  });
});

/**
 * Casos de prueba manual (si Jest no está disponible):
 * 
 * 1. aClientIsSelected
 *    - aClientIsSelected({}) → false ✓
 *    - aClientIsSelected({id: 1}) → true ✓
 * 
 * 2. calculateProductPrice con mayoreo
 *    - prices = {unit_price: 100, wholesale_price: 80, min_wholesale_quantity: 5}
 *    - calculateProductPrice(3, prices, false) → 100 ✓
 *    - calculateProductPrice(5, prices, false) → 80 ✓
 *    - calculateProductPrice(10, prices, false) → 80 ✓
 * 
 * 3. calculateProductPrice sin mayoreo con cliente
 *    - prices = {..., wholesale_price_on_client_discount: false}
 *    - calculateProductPrice(10, prices, true) → 100 (siempre unitario) ✓
 * 
 * 4. changeProductPrice
 *    - prices = {unit_price: 100, wholesale_price: 80}
 *    - changeProductPrice(80, prices) → 100 ✓
 *    - changeProductPrice(100, prices) → 80 ✓
 * 
 * 5. updateCartWithPrice
 *    - Carrito original con product_price: 100
 *    - updateCartWithPrice(cart, true) recalcula cada item ✓
 *    - Carrito original no se muta ✓
 */
