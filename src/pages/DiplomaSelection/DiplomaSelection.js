import React, { useState, useEffect } from "react";
import { IdeaHeader, JobAdvice } from "../../components";
import { Progress } from "reactstrap";
import { Container, Row, Col } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";
import routes from "../../routes.json";
import "./diplomaSelection.css";

const DiplomaSelection = () => {
  const { job } = useSelector((state) => state.filters);
  const dispatch = useDispatch();
  if (!job.label) dispatch(push(routes.LANDING));

  return (
    <div className="page jobSelection">
      <IdeaHeader />
      <Progress value={40} />
      <Container>
        <Row>
          <Col xs="12">
            <h2>As tu déjà un diplôme en lien avec le métier de {job.label} ?</h2>
          </Col>
        </Row>
        <Row>
          <Col xs="12 form"></Col>
        </Row>
        <Row>
          <JobAdvice />
        </Row>
      </Container>
    </div>
  );
};

export default DiplomaSelection;
