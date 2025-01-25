import { useEffect, useState, useCallback } from "react";
import Modal from "react-bootstrap/Modal";


function CustomModal({ showOut, title, children}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(showOut);
  }, [showOut]);

  const handleClose = useCallback(() => setShow(false), []);

  return (
    
      <Modal show={show} onHide={handleClose} size="lg"
      
      >
        <Modal.Header closeButton>
          <Modal.Title className=" w-100 text-center">
            {title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{backgroundColor: '#e1e9f4'}}>{children}
        </Modal.Body>
      </Modal>
    
  );
}

export default CustomModal;