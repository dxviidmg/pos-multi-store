import React from "react";
import CustomTable from "../commons/customTable/customTable";

const SERVICES = [
  {
    description: "Tienda/almacén",
    price: 500,
  },
  {
    description: "Instalación de impresora vía USB",
    price: 100,
    notes: "Tiempo de implementación: 1 a 2 semanas.",
  },
  {
    description: "Instalación de impresora vía WiFi",
    price: 250,
    notes: "Tiempo de implementación: 1 a 4 semanas.",
  },
  {
    description: "Módulo de vendedores (de 4 a 9)",
    price: 200,
  },
  {
    description: "Módulo de vendedores (+9)",
    price: 500,
  },
  {
    description: "Integración con sistemas de terceros",
    price: 500,
    notes: "El precio puede variar según los requerimientos específicos.",
  },
];

const ServiceList = () => {
  return (
    <>
      <div className="custom-section">
        <h1>Estimado cliente.</h1>

        <p>
          Queremos tomarnos un momento para agradecerte por tu confianza y
          lealtad. En <b>SmartVenta</b>, valoramos enormemente tu preferencia y
          nos esforzamos día a día para ofrecerte la mejor calidad y servicio.
          Como muestra de nuestro compromiso contigo, queremos presentarte
          nuestra lista de servicios adicionales que podrían ser de tu interés:
        </p>

        <CustomTable
          data={SERVICES}
          columns={[
            {
              name: "Descripción",
              selector: (row) => <>{row.description}</>,
            },
            {
              name: "Costo mensual",
              selector: (row) => <>${row.price}.00 MXN</>,
            },
            {
              name: "Notas",
              selector: (row) => <>{row.notes}</>,
            },
          ]}
        />
      </div>
    </>
  );
};

export default ServiceList;
