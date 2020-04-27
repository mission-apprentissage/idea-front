import React, { useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faBuilding } from "@fortawesome/free-solid-svg-icons";
import "../trainingList.css";
import { ResultCard } from "./index";
const ResultList = ({ listType, trainings, jobs }) => {
  useEffect(() => {
    if (listType === "training") {
      let header = document.getElementById("trainingCol");
      let sticky = header.offsetTop;

      window.onscroll = function () {
        if (window.pageYOffset > sticky + 280) {
          header.classList.remove("unsticky");
          header.classList.add("sticky");
        } else {
          header.classList.remove("sticky");
          header.classList.add("unsticky");
        }
      };
    }
  }, [listType]);

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
            <Col id="trainingCol" className="resultCardCol" xs="12">
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
