import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "../trainingList.css";

const ResultNav = () => {
  return (
    <Container className="resultNav">
      <Row>
        <Col xs="2">
          <Button className="left">
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
        </Col>
        <Col xs="8">Il y a 12 résultats pour votre recherche</Col>
        <Col xs="2">
          <Button className="right">
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ResultNav;
