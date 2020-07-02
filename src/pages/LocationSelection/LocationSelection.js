import React from "react";
import { IdeaHeader } from "../../components";
import { Progress, Container, Row, Col } from "reactstrap";
import { LocationSelectionForm } from "./components";
import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";
import routes from "../../routes.json";

import "./locationSelection.css";

const LocationSelection = () => {
  const { job, hasDiploma, diploma, trainingDuration, startTime } = useSelector((state) => state.filters);
  const dispatch = useDispatch();

  if (
    !job.label ||
    (hasDiploma !== true && hasDiploma !== false) ||
    (hasDiploma === true && !diploma) ||
    (hasDiploma === false && !trainingDuration) ||
    !startTime
  )
    dispatch(push(routes.LANDING));

  return (
    <div className="page locationSelection">
      <IdeaHeader />
      <Progress value={100} />
      <Container>
        <Row>
          <Col xs="12">
            <h2>Où souhaites-tu te former et travailler ?</h2>
          </Col>
        </Row>
        <Row>
          <Col xs="12 form">
            <LocationSelectionForm />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LocationSelection;
