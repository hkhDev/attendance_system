import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import "./index.scss";

export function Attendance(props) {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearched, setIsSearched] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === true) {
      handleSearch(e);
    }
    setValidated(true);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getEmployeeAttendance = (id) => {
    setIsLoading(true);

    // console.log(employeeId);
    axios
      .get(`/employeeattendance/${id}`)
      .then((res) => {
        console.log(res.data);
        setAttendanceRecords(res.data);
        setIsLoading(false);
        setIsSearched(true);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    getEmployeeAttendance(employeeId);
  };

  const getHoursDiff = (second) => {
    const hour = Math.floor((second * 2) / 3600) / 2;
    return hour;
  };

  return (
    <Container fluid="md" className="attendance">
      <h1 className="time">Check Attendance</h1>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <Col md="6" xs="8">
            <Form.Label>Enter Employee ID</Form.Label>
            <Form.Control
              type="number"
              required
              aria-label="Text input"
              value={employeeId}
              onChange={(e) => {
                setEmployeeId(e.target.value);
              }}
            />

            <Form.Control.Feedback type="invalid">
              Please enter an employee ID.
            </Form.Control.Feedback>
            {isLoading ? (
              <Button
                variant="primary"
                type="submit"
                disabled
                className="search-button"
              >
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Searching...
              </Button>
            ) : (
              <Button variant="primary" type="submit" className="search-button">
                Search
              </Button>
            )}

            <Button
              variant="secondary"
              className="back-button"
              onClick={handleBack}
            >
              Back
            </Button>
          </Col>
        </Row>
      </Form>
      <div className="record-table">
        {isSearched ? (
          attendanceRecords.length > 0 ? (
            <>
              <h2>
                {attendanceRecords[0].name} (Employee ID:{" "}
                {attendanceRecords[0].employee_id})
              </h2>
              <Table striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Clock In Time</th>
                    <th>Clock Out Time</th>
                    <th>Total Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((attendance, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {new Date(attendance.date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </td>
                        <td>
                          {new Date(
                            attendance.clock_in_time
                          ).toLocaleTimeString("en-US", { hour12: false })}
                        </td>
                        <td>
                          {attendance.clock_out_time !== null &&
                            new Date(
                              attendance.clock_out_time
                            ).toLocaleTimeString("en-US", { hour12: false })}
                        </td>
                        <td>
                          {attendance.seconds_different !== null &&
                            getHoursDiff(attendance.seconds_different)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </>
          ) : (
            <h2>No user found</h2>
          )
        ) : (
          <></>
        )}
      </div>
    </Container>
  );
}
