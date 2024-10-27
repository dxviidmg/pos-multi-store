import { useEffect } from "react";
import { Alert } from "react-bootstrap";


const CustomAlert = ({ messageAlert, isVisible, onClose }) => {
    useEffect(() => {
      if (isVisible) {
        const timer = setTimeout(() => {
          onClose();
        }, 10000);
  
        // Cleanup the timer if the component unmounts or isVisible changes
        return () => clearTimeout(timer);
      }
    }, [isVisible, onClose]);
  
    if (!isVisible) {
      return null;
    }
  
    return (
  
      <Alert key={'success'} variant={'success'}>
            {messageAlert}
          </Alert>
    );
  };
  
  export default CustomAlert;