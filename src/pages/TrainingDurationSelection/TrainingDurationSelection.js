import React, { useState } from "react";
import { IdeaHeader, JobAdvice } from "../../components";
import { Progress } from "reactstrap";
import { Button, Container, Row, Col, FormGroup, Label, Input } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";
import routes from "../../routes.json";
import { setTrainingDuration } from "../../redux/Filter/actions";
import "./trainingDurationSelection.css";

const TrainingDurationSelection = () => {
  const { job, hasDiploma, trainingDuration } = useSelector((state) => state.filters);
  const dispatch = useDispatch();

  if (!job.label || hasDiploma !== false) dispatch(push(routes.LANDING));

  const [tD, setTD] = useState(trainingDuration);
  const [hasError, setHasError] = useState(null);

  const handleChange = (response) => {
    setTD(response);
    setHasError(null);
    dispatch(setTrainingDuration(response));
  };

  const handleSubmit = () => {
    if (!tD) {
      setHasError(true);
    } else {
      setHasError(false);
      dispatch(push(routes.TRAININGSTARTTIME));
    }
  };

  const getRadioButton = (value, label, selectedValue) => {
    return (
      <Col xs="3" className="radioButton">
        <FormGroup check>
          <Label
            check
            className={`btn ${selectedValue === value ? "active" : ""}`}
            onClick={() => {
              handleChange(value);
            }}
          >
            <Input
              type="radio"
              name="trainingDuration"
              value="true"
              onChange={() => handleChange(value)}
              checked={selectedValue === value}
            />{" "}
            {label}
          </Label>
        </FormGroup>
      </Col>
    );
  };

  return (
    <div className="page trainingDuration">
      <IdeaHeader />
      <Progress value={60} />
      <Container>
        <Row>
          <Col xs="12">
            <h2>En combien de temps souhaites-tu suivre une formation ?</h2>
          </Col>
        </Row>
        <Row>
          <div className="buttons">
            <Container>
              <Row>
                {getRadioButton(1,"1 an",tD)}
                {getRadioButton(2,"2 ans",tD)}
                {getRadioButton(3,"3 ans",tD)}
                {getRadioButton(4,"> 3 ans",tD)}
              </Row>
            </Container>
          </div>
          {hasError ? (
            <Container>
              <Row>
                <Col xs="12" className="errorField">
                  Choisis une réponse
                </Col>
              </Row>
            </Container>
          ) : (
            ""
          )}
        </Row>

        <Row>
          <Col xs="12">
            <Button type="submit" onClick={handleSubmit}>
              Valider
            </Button>
          </Col>
        </Row>
        <Row>
          <JobAdvice />
        </Row>
      </Container>
    </div>
  );
};

export default TrainingDurationSelection;
