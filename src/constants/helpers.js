/**
 * Funciones helper de dominio — lógica pura de validación y transformación.
 * No tienen efectos secundarios; son reutilizables y testables.
 */

/**
 * Determina si una unidad de medida se vende por fracción (kilos, litros).
 * Usado en el carrito para saber si permitir cantidades decimales.
 * 
 * @param {string} unit - Código de unidad (KG, LT, PZ, etc.)
 * @returns {boolean}
 * 
 * @example
 * isWeightedUnit('KG') // true
 * isWeightedUnit('LT') // true
 * isWeightedUnit('PZ') // false
 */
export const isWeightedUnit = (unit) => unit === 'KG' || unit === 'LT';
