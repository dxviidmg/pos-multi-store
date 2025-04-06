import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Col, Form, Row } from "react-bootstrap";
import { getSellers } from "../apis/sellers";
import CustomButton from "../commons/customButton/CustomButton";
import { useDispatch } from "react-redux";
import { hideSellerModal, showSellerModal } from "../redux/sellerModal/SellerModalActions";
import SellerModal from "../sellerModal/SellerModal";
import { getDateDifference, getFormattedDate } from "../utils/utils";
import { chooseIcon } from "../commons/icons/Icons";




const SellerList = () => {
  const today = getFormattedDate();
  const dispatch = useDispatch();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState('')

  const [params, setParams] = useState({
    end_date: today,
    start_date: today,
  });

  useEffect(() => {
    const fetchSellersData = async () => {
      setLoading(true);
      const sellersResponse = await getSellers(params);
      setSellers(sellersResponse.data);
      setRange( getDateDifference(params.start_date, params.end_date))
      setLoading(false);
    };

    fetchSellersData();
  }, [params]);

  const handleOpenModal = (brand) => {
    dispatch(hideSellerModal());
    setTimeout(() => dispatch(showSellerModal(brand)));
  };


  const handleUpdateSellerList = (updatedBrand) => {
    setSellers((prevBrands) => {
      const brandExists = prevBrands.some((b) => b.id === updatedBrand.id);
      return brandExists
        ? prevBrands.map((b) => (b.id === updatedBrand.id ? updatedBrand : b))
        : [...prevBrands, updatedBrand];
    });
  };


  const handleParams = async (e) => {
    let { name, value } = e.target;
    setParams((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      <div className="custom-section">
        <SellerModal onUpdateSellerList={handleUpdateSellerList}></SellerModal>
        <Form.Label className="fw-bold">Lista de vendedores</Form.Label>
        <br></br>
        <CustomButton onClick={() => handleOpenModal()}>Crear</CustomButton>
        <Row>

        <Col>
            {" "}
            <Form>
              <Form.Label>Fecha de inicio</Form.Label>
              <Form.Control
                name="start_date"
                type="date"
                value={params.start_date}
                onChange={(e) => handleParams(e)}
                max={today}
              />
            </Form>
          </Col>
          <Col>
            {" "}
            <Form>
              <Form.Label>Fecha de fin</Form.Label>
              <Form.Control
                name="end_date"
                type="date"
                value={params.end_date}
                onChange={(e) => handleParams(e)}
                max={today}
              />
            </Form>

            </Col>

            <Col>
          <Form>
              <Form.Label>Rango</Form.Label>
              <Form.Control
                name="range"
                type="input"
                value={range}
                disabled
              />
            </Form>
          </Col>

        </Row>
        <CustomTable
        progressPending={loading}
          data={sellers}
          pagination={false}
          columns={[
            {
              name: "Tienda",
              selector: (row) => row.store_detail?.name,
            },

            {
              name: "Username",
              selector: (row) => row.worker.username,
              grow: 2,
            },
            {
              name: "Nombre",

              selector: (row) => `${row.worker.first_name} ${row.worker.last_name}`,
            },
            {
              name: "Esta activo",
              selector: (row) => chooseIcon(row.worker.is_active),
            },
            {
              name: "Vendido",
              selector: (row) => `$${row.total_sales}`,
            }
          ]}
        />
      </div>
    </>
  );
};

export default SellerList;
