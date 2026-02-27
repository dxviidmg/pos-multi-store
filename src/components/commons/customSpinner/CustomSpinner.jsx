import { memo } from "react";
import "./CustomSpinner.css";
import Spinner from 'react-bootstrap/Spinner';

export const CustomSpinner = memo(({isLoading}) => {
  if (!isLoading) {
    return null;
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
});