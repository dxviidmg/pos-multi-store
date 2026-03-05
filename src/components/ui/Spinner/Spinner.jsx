import { memo } from "react";
import "./Spinner.css";
import { CircularProgress } from '@mui/material';

export const CustomSpinner = memo(({isLoading}) => {
  if (!isLoading) {
    return null;
  }
  
	return (
    <div className="overlay">
      <div className="spinner-container">
        <CircularProgress size={60} />
      </div>
    </div>
	);
});