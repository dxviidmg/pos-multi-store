import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { deleteTransfer, getTransfers } from "../apis/transfers";
import { calculateTimeAgo } from "../utils/utils";
import CustomButton from "../commons/customButton/CustomButton";
import Swal from "sweetalert2";
import { RemoveInCartIcon } from "../commons/icons/Icons";

const TransferList = () => {
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getTransfers();
      setTransfers(response.data);
    };

    fetchData();
  }, []);

  const handleOpenModal = async (transfer) => {
    const response = await deleteTransfer(transfer.id)


    if (response.status === 204){

      setTransfers((prevTransfers) => {
        const updatedList = prevTransfers.filter(
          (item) => item.id !== transfer.id
        );
        return updatedList;
      });

      Swal.fire({
        icon: "success",
        title: "Tranferencia eliminada",
        timer: 5000,
      });
    }
    else{
      Swal.fire({
        icon: "error",
        title: "Error al eliminar transferencia",
        timer: 5000,
      });
    }
  };


  return (
    <>
      <div className="">
        <CustomTable
          noDataComponent="Sin traspasos pendientes"
          data={transfers}
          columns={[
            {
              name: "#",
              selector: (row) => row.id,
            },
            {
              name: "Código",
              selector: (row) => row.product_code,
              grow: 2,
            },
            {
              name: "Producto",
              selector: (row) => row.product_description,
              grow: 4,
              wrap: true,
            },
            {
              name: "Cantidad",
              selector: (row) => row.quantity,
            },

            {
              name: "Descripción",
              selector: (row) => row.description,
              wrap: true,
              grow: 4,
            },
            {
              name: "Creado hace",
              selector: (row) => calculateTimeAgo(row.created_at),
              grow: 2
            },
            {
              name: "Acciones",
              selector: (row) => (
                <CustomButton onClick={() => handleOpenModal(row)} disabled={row.description.includes('prov')}>
                  <RemoveInCartIcon></RemoveInCartIcon>
                </CustomButton>
              ),
              grow: 2,
            },
          ]}
        />
      </div>
    </>
  );
};

export default TransferList;
