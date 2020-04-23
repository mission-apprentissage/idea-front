import React from "react";
import { Container, Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faBuilding } from "@fortawesome/free-solid-svg-icons";
import "../trainingList.css";
import { ResultCard } from "./index";
const ResultList = ({ listType, trainings, jobs }) => {
  console.log("listType : ", listType, trainings, jobs);

  return (
    <Container className={listType + " resultList"}>
      {listType === "training" ? (
        <>
          <Row>
            <Col className="matchLevel" xs="12">
              <div style={{ float: "left" }}>Le meilleur résultat</div>
              <div style={{ float: "right" }}>100%</div>
            </Col>
          </Row>
          <Row>
            <Col className="resultListHeader" xs="12">
              <FontAwesomeIcon icon={faGraduationCap} />
              Où se Former ?
            </Col>
          </Row>
          <Row>
            <Col className="resultCardCol" xs="12">
              <ResultCard type={listType} item={trainings[0]} />
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row>
            <Col className="resultListHeader" xs="12">
              <FontAwesomeIcon icon={faBuilding} />
              Où trouver un job ?
            </Col>
          </Row>
          {jobs.map((job, idx) => (
            <Row key={idx}>
              <Col className="resultCardCol" xs="12">
                <ResultCard type={listType} item={job} />
              </Col>
            </Row>
          ))}
        </>
      )}
    </Container>
  );
};

export default ResultList;
