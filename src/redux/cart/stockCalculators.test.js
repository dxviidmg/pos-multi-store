/**
 * Tests para stockCalculators.js
 * Verifica que el cálculo de stock disponible es correcto.
 */

import {
  getReservedStock,
  getAvailableStockForActiveCart,
} from "./stockCalculators";
import { MOVEMENT_TYPES } from "../../constants";

describe("stockCalculators", () => {
  describe("getReservedStock", () => {
    it("calcula stock reservado en otros carritos", () => {
      const carts = [
        {
          id: 1,
          cart: [{ id: 10, quantity: 5 }],
        },
        {
          id: 2,
          cart: [{ id: 10, quantity: 3 }],
        },
      ];

      const reserved = getReservedStock(carts, 10, 1);
      expect(reserved).toBe(3); // Solo carrito 2
    });

    it("retorna 0 si no hay stock reservado", () => {
      const carts = [
        {
          id: 1,
          cart: [{ id: 10, quantity: 5 }],
        },
        {
          id: 2,
          cart: [],
        },
      ];

      const reserved = getReservedStock(carts, 10, 2);
      expect(reserved).toBe(5);
    });

    it("excluye el carrito activo cuando no se pasa excludeCartId", () => {
      const carts = [
        {
          id: 1,
          cart: [{ id: 10, quantity: 5 }],
        },
        {
          id: 2,
          cart: [{ id: 10, quantity: 3 }],
        },
      ];

      const reserved = getReservedStock(carts, 10); // Sin excludeCartId
      expect(reserved).toBe(8); // Suma ambos carritos
    });

    it("retorna 0 si el producto no existe en ningún carrito", () => {
      const carts = [
        {
          id: 1,
          cart: [{ id: 10, quantity: 5 }],
        },
      ];

      const reserved = getReservedStock(carts, 999, 1);
      expect(reserved).toBe(0);
    });
  });

  describe("getAvailableStockForActiveCart", () => {
    const mockState = (carts) => ({ carts, activeCartId: 1 });
    const mockActiveCart = (movementType) => ({
      id: 1,
      movementType,
      cart: [],
    });

    it("usa available_stock en operaciones de SALE", () => {
      const state = mockState([
        {
          id: 1,
          cart: [],
        },
        {
          id: 2,
          cart: [{ id: 10, quantity: 2 }], // Reservado en otro carrito
        },
      ]);
      const activeCart = mockActiveCart(MOVEMENT_TYPES.SALE);
      const product = {
        id: 10,
        available_stock: 10,
        reserved_stock: 3,
      };

      const available = getAvailableStockForActiveCart(state, activeCart, product);
      expect(available).toBe(8); // 10 - 2 (otro carrito)
    });

    it("usa reserved_stock en operaciones de TRANSFER", () => {
      const state = mockState([
        {
          id: 1,
          cart: [],
        },
        {
          id: 2,
          cart: [{ id: 10, quantity: 1 }],
        },
      ]);
      const activeCart = mockActiveCart(MOVEMENT_TYPES.TRANSFER);
      const product = {
        id: 10,
        available_stock: 10,
        reserved_stock: 3,
      };

      const available = getAvailableStockForActiveCart(state, activeCart, product);
      expect(available).toBe(2); // 3 - 1 (otro carrito)
    });

    it("descuenta stock de otros carritos", () => {
      const state = mockState([
        {
          id: 1,
          cart: [],
        },
        {
          id: 2,
          cart: [{ id: 10, quantity: 3 }],
        },
        {
          id: 3,
          cart: [{ id: 10, quantity: 2 }],
        },
      ]);
      const activeCart = mockActiveCart(MOVEMENT_TYPES.SALE);
      const product = {
        id: 10,
        available_stock: 15,
        reserved_stock: 5,
      };

      const available = getAvailableStockForActiveCart(state, activeCart, product);
      expect(available).toBe(10); // 15 - 3 - 2 (otros carritos)
    });

    it("retorna 0 si no hay stock", () => {
      const state = mockState([
        {
          id: 1,
          cart: [],
        },
      ]);
      const activeCart = mockActiveCart(MOVEMENT_TYPES.SALE);
      const product = {
        id: 10,
        available_stock: 0,
        reserved_stock: 0,
      };

      const available = getAvailableStockForActiveCart(state, activeCart, product);
      expect(available).toBe(0);
    });

    it("retorna negativo si hay más reservado que disponible", () => {
      const state = mockState([
        {
          id: 1,
          cart: [],
        },
        {
          id: 2,
          cart: [{ id: 10, quantity: 15 }],
        },
      ]);
      const activeCart = mockActiveCart(MOVEMENT_TYPES.SALE);
      const product = {
        id: 10,
        available_stock: 10,
        reserved_stock: 0,
      };

      const available = getAvailableStockForActiveCart(state, activeCart, product);
      expect(available).toBe(-5); // 10 - 15
    });
  });
});

/**
 * Casos de prueba manual:
 * 
 * 1. getReservedStock
 *    - Carrito 1: producto 10 x5
 *    - Carrito 2: producto 10 x3
 *    - getReservedStock(carts, 10, 1) → 3 ✓
 *    - getReservedStock(carts, 10, 2) → 5 ✓
 * 
 * 2. getAvailableStockForActiveCart en SALE
 *    - available_stock: 10
 *    - reserved_stock: 3
 *    - Otro carrito: qty 2
 *    - En SALE: 10 - 2 = 8 ✓
 * 
 * 3. getAvailableStockForActiveCart en TRANSFER
 *    - available_stock: 10
 *    - reserved_stock: 3
 *    - Otro carrito: qty 1
 *    - En TRANSFER: 3 - 1 = 2 ✓
 * 
 * 4. Múltiples carritos descuentan
 *    - Stock: 15
 *    - Carrito 2: qty 3
 *    - Carrito 3: qty 2
 *    - Disponible: 15 - 3 - 2 = 10 ✓
 */
