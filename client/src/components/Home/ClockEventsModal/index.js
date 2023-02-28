import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";

export function ClockEventsModal(props) {
  const [employeeID, setemployeeID] = useState("");

  const handleClose = () => props.setModalClose(false);
  // const handleShow = () => setShow(true);
  const handleSubmit = (e) => {
    e.preventDefault();
    props.updateShift(employeeID);
    setemployeeID("");

    // handleClose();
  };
  return (
    <Modal show={props.show} onHide={handleClose}>
      {props.clockInOutStatus ? (
        <>
          <Modal.Header closeButton>
            <Modal.Title>{props.title} Shift</Modal.Title>
          </Modal.Header>
          <Modal.Body>{props.clockInOutMsg}</Modal.Body>
        </>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{props.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formBasicID">
              <FloatingLabel
                controlId="floatingInput"
                label="Employee ID"
                className="mb-3"
              >
                <Form.Control
                  type="string"
                  placeholder="6111111"
                  value={employeeID}
                  onChange={(e) => {
                    setemployeeID(e.target.value);
                  }}
                />
              </FloatingLabel>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              {props.title}
            </Button>
          </Modal.Footer>
        </Form>
      )}
    </Modal>
  );
}
