import "./customSpinner.css";
import Spinner from 'react-bootstrap/Spinner';

export const CustomSpinner = () => {

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

export const CustomSpinner2 = ({isLoading}) => {
  if (!isLoading) {
    return null; // No renderiza nada si isLoading es false
  }
  
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