import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Spinner from "react-bootstrap/Spinner";

export function ClockEventsModal(props) {
  const [employeeID, setemployeeID] = useState("");

  const handleClose = () => {
    setemployeeID("");
    props.setModalClose(false);
  };
  // const handleShow = () => setShow(true);
  const handleSubmit = (e) => {
    e.preventDefault();
    props.updateShift(employeeID);
    setemployeeID("");
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
                  type="number"
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
            {props.isLoading ? (
              <Button variant="primary" type="submit" disabled>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Loading...
              </Button>
            ) : (
              <Button variant="primary" type="submit">
                {props.title}
              </Button>
            )}
          </Modal.Footer>
        </Form>
      )}
    </Modal>
  );
}
