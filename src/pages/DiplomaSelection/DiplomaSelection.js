import React from "react";
import { IdeaHeader, JobAdvice } from "../../components";
import { Progress } from "reactstrap";
import { Container, Row, Col } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";
import routes from "../../routes.json";
import "./diplomaSelection.css";
import { DiplomaSelectionForm } from "./components";

const DiplomaSelection = () => {
  const { job, hasDiploma } = useSelector((state) => state.filters);
  const dispatch = useDispatch();

  if (!job.label || hasDiploma !== true) dispatch(push(routes.LANDING));

  return (
    <div className="page diplomaSelection">
      <IdeaHeader />
      <Progress value={60} />
      <Container>
        <Row>
          <Col xs="12">
            <h2>Quel est le diplôme en lien avec le métier que tu as déjà ?</h2>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <DiplomaSelectionForm />
          </Col>
        </Row>
        <Row>
          <JobAdvice />
        </Row>
      </Container>
    </div>
  );
};

export default DiplomaSelection;
