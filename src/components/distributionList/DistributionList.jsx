import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import CustomButton from "../commons/customButton/CustomButton";
import { getFormattedDateTime } from "../utils/utils";
import { CustomSpinner2 } from "../commons/customSpinner/CustomSpinner";
import { CheckIcon, EditIcon, RemoveInCartIcon } from "../commons/icons/Icons";
import CustomTooltip from "../commons/Tooltip";
import { confirmDistribution, deleteTranfer, getDistributions, updateTranfer } from "../apis/transfers";
import { Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";

const DistributionList = () => {
  const [distributions, setDistributions] = useState([]);
  const [distributionSelected, setDistributionSelected] = useState({});

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);

      const distributions = await getDistributions();

      console.log(distributions.data);

      setDistributions(distributions.data);
      setLoading(false);
    };

    fetchSalesData();
  }, []);

  const handleOpenModal = (distribution) => {
    console.log("effe");
    setDistributionSelected(distribution);
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    console.log(distributionSelected.id);
    const response = await confirmDistribution({ id: distributionSelected.id });
    console.log(response);

    if (response.status === 200) {
      const distributions2 = distributions.filter(
        (distribution) => distribution.id !== distributionSelected.id
      );

      setDistributions(distributions2);
      setDistributionSelected({});
      setTimeout(() => {
        setLoading(false);
      }, 28);
      Swal.fire({
        icon: "success",
        title: "Distribición realizada",
        timer: 5000,
      });
    } else {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error al distribuir",
        timer: 5000,
      });
    }
  };


  const [editingRow, setEditingRow] = useState(null);
  const [editedQuantity, setEditedQuantity] = useState("");

  const handleEditClick = (row) => {
    setEditingRow(row.product_code); // o row.id si lo tienes
    setEditedQuantity(row.quantity);
  };

  const handleSaveClick = async (row) => {
    console.log(row)
    // Aquí puedes manejar la lógica para guardar el cambio (API o estado padre)
    console.log("Nueva cantidad:", editedQuantity, "para:", row.product_code);

    row.quantity = editedQuantity
    const response = await updateTranfer(row)
    console.log(response)
    setEditingRow(null);
  };


  const handleDeleteTransfer = async (row) => {
    console.log(row)
    // Aquí puedes manejar la lógica para guardar el cambio (API o estado padre)
    console.log("Nueva cantidad:", editedQuantity, "para:", row.product_code);

    const updatedList = distributionSelected.transfers.filter(transfer => transfer.id !== row.id);

    const response = await deleteTranfer(row)

    if (response.status === 204){
      setDistributionSelected({
        ...distributionSelected,      // conserva las demás propiedades
        transfers: updatedList,       // actualiza solo la lista de transfers
      });
    }

  };

  return (
    <>
      <CustomSpinner2 isLoading={loading}></CustomSpinner2>
      <div className="custom-section">
        <h1>Distribuciones</h1>
        <CustomTable
          data={distributions}
          pagination={false}
          columns={[
            {
              name: "#",
              selector: (row) => row.id,
            },
            {
              name: "Creacion",
              selector: (row) => getFormattedDateTime(row.created_at),
              wrap: true,
            },
            {
              name: "Descripción",
              grow: 2,
              selector: (row) => row.description,
            },

            {
              name: "Acciones",
              cell: (row) => (
                <CustomTooltip text={"Ver productos"}>
                  <CustomButton onClick={() => handleOpenModal(row)}>
                    <CheckIcon></CheckIcon>
                  </CustomButton>
                </CustomTooltip>
              ),
            },
          ]}
        />
      </div>

      {Object.keys(distributionSelected).length !== 0 && (
        <div className="custom-section">
          <Row>
            <Col>
              {" "}
              <h1>Distribución #{distributionSelected.id}</h1>
            </Col>
            <Col>
              {" "}
              <CustomButton fullWidth onClick={() => handleSubmit()}>
                Confirmar distribución
              </CustomButton>
            </Col>
          </Row>
          <CustomTable
            data={distributionSelected.transfers || []}
            pagination={false}
            columns={[
              {
                name: "Código",
                selector: (row) => row.product_code,
              },
              {
                name: "Producto",
                selector: (row) => row.product_description,
              },
               {
                name: "Cantidad",
                cell: (row) =>
                  editingRow === row.product_code ? (
                    <Form.Control
                      type="number"
                      value={editedQuantity}
                      onChange={(e) => setEditedQuantity(e.target.value)}
                      style={{ width: "80px", textAlign: "center" }}
                      min={1}
                      max={row.editable_product_max_stock}
                    />
                  ) : (
                    row.quantity
                  ),
              },
              {
                name: "Acciones",
                cell: (row) =>
                  editingRow === row.product_code ? (
                    <CustomButton onClick={() => handleSaveClick(row)}>Guardar</CustomButton>
                  ) : (
                    <>
                                        <CustomTooltip text="Editar cantidad">
                      <CustomButton onClick={() => handleEditClick(row)}>
                        <EditIcon />
                      </CustomButton>
                    </CustomTooltip>

                    <CustomTooltip text="Borrar producto">
                      <CustomButton onClick={() => handleDeleteTransfer(row)}>
                        <RemoveInCartIcon />
                      </CustomButton>
                    </CustomTooltip>
                    </>


                    
                  ),
              },
            ]}
          />
        </div>
      )}
    </>
  );
};

export default DistributionList;

