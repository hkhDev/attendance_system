import { useState, useEffect } from "react";
import axios from "axios";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { LinkContainer } from "react-router-bootstrap";
import { ClockEventsModal } from "./ClockEventsModal";
import "./index.scss";

export function Home(props) {
  const [date, setDate] = useState(new Date());
  const [startModalshow, setStartModalShow] = useState(false);
  const [endModalShow, setEndModalShow] = useState(false);
  const [clockInOutStatus, setClockInOutStatus] = useState(false);
  const [clockInOutMsg, setClockInOutMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    var timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanUp() {
      clearInterval(timer);
    };
  });

  const startShift = (id) => {
    setClockInOutMsg("");
    setIsLoading(true);
    axios
      .post("/newclockinrecord", { employee_id: id })
      .then((res) => {
        console.log(res.data);
        console.log("Start Shift");
        console.log(res.data.name[0].name);
        setClockInOutMsg(
          `${res.data.name[0].name} has successfully clocked in`
        );
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error");
        setClockInOutMsg(error.response.data.error);
        console.log(error.response);
      });
    setClockInOutStatus(true);
  };

  const endShift = (id) => {
    setClockInOutMsg("");
    setIsLoading(true);
    axios
      .put("/newclockoutrecord", { employee_id: id })
      .then((res) => {
        console.log(res.data);
        console.log("End Shift");
        console.log(res.data.name[0].name);
        setClockInOutMsg(
          `${res.data.name[0].name} has successfully clocked out`
        );
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error");
        setClockInOutMsg(error.response.data.error);
        console.log(error.response);
      });
    setClockInOutStatus(true);
  };

  return (
    <Container fluid="md" className="home">
      <h1 className="time">{date.toLocaleTimeString("en")}</h1>
      <Row className="justify-content-center">
        <Col md="3" xs="8" className="home-button">
          <Image
            roundedCircle
            fluid
            src="images/clock_in.png"
            className="home-button-img hand-cursor"
            onClick={() => {
              setStartModalShow(true);
              setClockInOutStatus(false);
              setClockInOutMsg("");
              setIsLoading(false);
            }}
          />
          <h2>Start Shift</h2>
        </Col>
        <Col md="3" xs="8" className="home-button">
          <Image
            roundedCircle
            fluid
            src="images/clock_out.png"
            className="home-button-img hand-cursor"
            onClick={() => {
              setEndModalShow(true);
              setClockInOutStatus(false);
              setClockInOutMsg("");
              setIsLoading(false);
            }}
          />
          <h2>End Shift</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="3" xs="8" className="home-button">
          <LinkContainer to="/Attendance">
            <Image
              roundedCircle
              fluid
              src="images/schedule_record.png"
              className="home-button-img hand-cursor"
            />
          </LinkContainer>
          <h2>Check Attendance</h2>
        </Col>
      </Row>
      <Row className="justify-content-md-center"></Row>
      <ClockEventsModal
        show={startModalshow}
        title="Start"
        updateShift={startShift}
        setModalClose={setStartModalShow}
        clockInOutStatus={clockInOutStatus}
        clockInOutMsg={clockInOutMsg}
        isLoading={isLoading}
      />
      <ClockEventsModal
        show={endModalShow}
        title="End"
        updateShift={endShift}
        setModalClose={setEndModalShow}
        clockInOutStatus={clockInOutStatus}
        clockInOutMsg={clockInOutMsg}
        isLoading={isLoading}
      />
    </Container>
  );
}
