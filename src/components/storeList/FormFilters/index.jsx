import { Form, Row, Col } from "react-bootstrap";
import CustomButton from "../../commons/customButton/CustomButton";
import PropTypes from "prop-types";

export const FormFilters = ({
  params,
  handleParams,
  today,
  range,
  departments,
  handleShowInvestment,
}) => {
  return (
    <>
      <Form>
        <Row>
          <Col>
            <Form.Group controlId="start_date">
              <Form.Label>Fecha de inicio</Form.Label>
              <Form.Control
                name="start_date"
                type="date"
                value={params.start_date}
                onChange={handleParams}
                max={today}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="end_date">
              <Form.Label>Fecha de fin</Form.Label>
              <Form.Control
                name="end_date"
                type="date"
                value={params.end_date}
                onChange={handleParams}
                max={today}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="range">
              <Form.Label>Rango</Form.Label>
              <Form.Control name="range" type="text" value={range} disabled />
            </Form.Group>
          </Col>

          <Col hidden={departments.length === 0}>
            <Form.Group controlId="department_id">
              <Form.Label>Departamento</Form.Label>
              <Form.Select
                value={params.department_id}
                onChange={handleParams}
                name="department_id"
              >
                <option value="">Todos</option>
                <option value="0">Sin departamento</option>
                {departments.map((departament) => (
                  <option key={departament.id} value={departament.id}>
                    {departament.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col className="d-flex align-items-end">
            <CustomButton fullWidth onClick={handleShowInvestment}>
              Ver inversión
            </CustomButton>
          </Col>
        </Row>
      </Form>
    </>
  );
};

FormFilters.propTypes = {
  params: PropTypes.shape({
    end_date: PropTypes.string,
    start_date: PropTypes.string,
  }),
  handleParams: PropTypes.func.isRequired,
  today: PropTypes.string.isRequired,
  range: PropTypes.string,
  departments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      product_count: PropTypes.number,
    })
  ),
  handleShowInvestment: PropTypes.func.isRequired,
};

export default FormFilters;
