const plural = (count, singular, pluralForm) => (count === 1 ? singular : pluralForm);

export const storesLabel = (count) => `${count} ${plural(count, "tienda", "tiendas")}`;
export const warehousesLabel = (count) => `${count} ${plural(count, "almacén", "almacenes")}`;
export const branchesLabel = (count) => `${count} ${plural(count, "sucursal", "sucursales")}`;

/** Pidió ampliar solo si quiere más tiendas o más almacenes que los actuales. */
export const wantsMoreBranches = ({ stores, warehouses, currentStores, currentWarehouses }) =>
  stores > currentStores || warehouses > currentWarehouses;

export const buildStoreUpdateMessage = ({ stores, warehouses, currentStores, currentWarehouses }) =>
  `Hola, actualmente tengo ${storesLabel(currentStores)} y ${warehousesLabel(currentWarehouses)}. `
  + `Por lo que ahora quiero tener ${storesLabel(stores)} y ${warehousesLabel(warehouses)}, `
  + `dando un total de ${branchesLabel(stores + warehouses)}.`;

export const buildConsultMessage = (serviceTitle, text) =>
  `Hola, me gustaría solicitar cambios en ${serviceTitle}: ${text}`;
