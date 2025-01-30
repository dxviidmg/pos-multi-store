import { useEffect, useState, useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import './customModal.css'


function CustomModal({ showOut, title, children}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(showOut);
  }, [showOut]);

  const handleClose = useCallback(() => setShow(false), []);

  return (
    
      <Modal show={show} onHide={handleClose} size="lg"
      
      
      >
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title className=" w-100 text-center">
            {title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">{children}
        </Modal.Body>
      </Modal>
    
  );
}

export default CustomModal;