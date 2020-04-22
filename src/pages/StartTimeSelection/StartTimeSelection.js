import React from "react";
import { IdeaHeader, JobAdvice } from "../../components";
import { Progress } from "reactstrap";
import { Container, Row, Col } from "reactstrap";
import { StartTimeSelectionForm } from "./components";
import "./startTimeSelection.css";
import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";
import routes from "../../routes.json";

const JobSelection = () => {
  const { job, hasDiploma, diploma, trainingDuration } = useSelector((state) => state.filters);
  const dispatch = useDispatch();

  if (
    !job.label ||
    (hasDiploma !== true && hasDiploma !== false) ||
    (hasDiploma === true && !diploma) ||
    (hasDiploma === false && !trainingDuration)
  )
    dispatch(push(routes.LANDING));

  return (
    <div className="page startTimeSelection">
      <IdeaHeader />
      <Progress value={80} />
      <Container>
        <Row>
          <Col xs="12">
            <h2>Tu veux démarrer ton projet ...</h2>
          </Col>
        </Row>
        <Row>
          <Col xs="12 form">
            <StartTimeSelectionForm />
          </Col>
        </Row>
        <Row>
          <JobAdvice />
        </Row>
      </Container>
    </div>
  );
};

export default JobSelection;
