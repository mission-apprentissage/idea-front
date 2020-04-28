import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "../trainingList.css";

const ResultNav = ({ rank, goToPreviousTraining, goToNextTraining }) => {
  return (
    <Container className="resultNav">
      <Row>
        <Col xs="2">
          {rank === 1 ? (
            <Button className="left" onClick={goToPreviousTraining}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </Button>
          ) : (
            ""
          )}
        </Col>
        <Col xs="8">Il y a 2 résultats pour votre recherche</Col>
        <Col xs="2">
          {rank === 0 ? (
            <Button className="right" onClick={goToNextTraining}>
              <FontAwesomeIcon icon={faChevronRight} />
            </Button>
          ) : (
            ""
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ResultNav;
