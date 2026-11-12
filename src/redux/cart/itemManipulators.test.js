/**
 * Tests para itemManipulators.js
 * Verifica que la manipulación de items es correcta.
 */

import {
  appendNewItem,
  incrementItemAt,
  setItemQuantity,
} from "./itemManipulators";
import {
  calculateProductPrice,
  aClientIsSelected,
} from "./priceCalculators";

describe("itemManipulators", () => {
  describe("appendNewItem", () => {
    it("agrega un nuevo item con precio calculado", () => {
      const activeCart = {
        id: 1,
        cart: [],
        client: {},
      };
      const payload = {
        id: 10,
        quantity: 5,
        product: {
          prices: {
            unit_price: 100,
            wholesale_price: 80,
            min_wholesale_quantity: 5,
            wholesale_price_on_client_discount: true,
          },
        },
      };

      const newCart = appendNewItem(
        activeCart,
        payload,
        calculateProductPrice,
        aClientIsSelected
      );

      expect(newCart).toHaveLength(1);
      expect(newCart[0].id).toBe(10);
      expect(newCart[0].quantity).toBe(5);
      expect(newCart[0].product_price).toBe(80); // 5 >= 5, aplica mayoreo
    });

    it("no muta el carrito original", () => {
      const activeCart = {
        id: 1,
        cart: [],
        client: {},
      };
      const payload = {
        id: 10,
        quantity: 5,
        product: {
          prices: {
            unit_price: 100,
            wholesale_price: 80,
            min_wholesale_quantity: 5,
            wholesale_price_on_client_discount: true,
          },
        },
      };

      const original = JSON.parse(JSON.stringify(activeCart.cart));
      appendNewItem(activeCart, payload, calculateProductPrice, aClientIsSelected);
      expect(activeCart.cart).toEqual(original);
    });
  });

  describe("incrementItemAt", () => {
    it("incrementa la cantidad en la posición correcta", () => {
      const cart = [
        { id: 10, quantity: 5 },
        { id: 20, quantity: 3 },
      ];

      const newCart = incrementItemAt(cart, 0, 10);
      expect(newCart[0].quantity).toBe(15); // 5 + 10
      expect(newCart[1].quantity).toBe(3); // Sin cambios
    });

    it("no muta el carrito original", () => {
      const cart = [{ id: 10, quantity: 5 }];
      const original = JSON.parse(JSON.stringify(cart));
      incrementItemAt(cart, 0, 10);
      expect(cart).toEqual(original);
    });
  });

  describe("setItemQuantity", () => {
    it("actualiza la cantidad y recalcula precio", () => {
      const activeCart = {
        id: 1,
        cart: [
          {
            id: 10,
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
        ],
        client: {},
      };
      const product = { id: 10, available_stock: 20 };

      const newCart = setItemQuantity(
        activeCart,
        product,
        5,
        calculateProductPrice,
        aClientIsSelected
      );

      expect(newCart[0].quantity).toBe(5);
      expect(newCart[0].product_price).toBe(80); // 5 >= 5, aplica mayoreo
      expect(newCart[0].available_stock).toBe(20);
    });

    it("actualiza solo el item correcto", () => {
      const activeCart = {
        id: 1,
        cart: [
          {
            id: 10,
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
            id: 20,
            quantity: 2,
            product: {
              prices: {
                unit_price: 50,
                wholesale_price: 40,
                min_wholesale_quantity: 10,
                wholesale_price_on_client_discount: true,
              },
            },
            product_price: 50,
          },
        ],
        client: {},
      };
      const product = { id: 10, available_stock: 20 };

      const newCart = setItemQuantity(
        activeCart,
        product,
        5,
        calculateProductPrice,
        aClientIsSelected
      );

      expect(newCart[0].quantity).toBe(5); // Actualizado
      expect(newCart[1].quantity).toBe(2); // Sin cambios
    });

    it("no muta el carrito original", () => {
      const activeCart = {
        id: 1,
        cart: [
          {
            id: 10,
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
        ],
        client: {},
      };
      const product = { id: 10, available_stock: 20 };
      const original = JSON.parse(JSON.stringify(activeCart.cart));

      setItemQuantity(
        activeCart,
        product,
        5,
        calculateProductPrice,
        aClientIsSelected
      );

      expect(activeCart.cart).toEqual(original);
    });
  });
});

/**
 * Casos de prueba manual:
 * 
 * 1. appendNewItem
 *    - Carrito vacío
 *    - Agrega producto x5 con mayoreo desde 5
 *    - Resultado: 1 item con qty=5, price=80 ✓
 * 
 * 2. incrementItemAt
 *    - Carrito: [item A x5, item B x3]
 *    - Incrementa item A en 10
 *    - Resultado: [item A x15, item B x3] ✓
 * 
 * 3. setItemQuantity
 *    - Carrito: [item A x3 ($100), item B x2 ($50)]
 *    - Actualiza item A a qty=5
 *    - Resultado: [item A x5 ($80), item B x2 ($50)] ✓
 */
