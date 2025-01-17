import "./customSpinner.css";
import Spinner from 'react-bootstrap/Spinner';

const CustomSpinner = () => {

	return (
    <div className="overlay">
    <div className="spinner-container">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  </div>
	);
};

export default CustomSpinner