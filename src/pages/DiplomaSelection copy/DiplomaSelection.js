import React, { useState } from "react";
import { IdeaHeader, JobAdvice } from "../../components";
import { Progress } from "reactstrap";
import { Button, Container, Row, Col, FormGroup, Label, Input } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";
import routes from "../../routes.json";
import { setHasDiploma } from "../../redux/Filter/actions";
import "./diplomaSelection.css";

const DiplomaSelection = () => {
  const { job, hasDiploma } = useSelector((state) => state.filters);
  const dispatch = useDispatch();

  if (!job.label) dispatch(push(routes.LANDING));

  const [hD, setHD] = useState(hasDiploma);
  const [hasError, setHasError] = useState(null);

  const handleChange = (response) => {
    setHD(response);
    setHasError(null);
    dispatch(setHasDiploma(response));
  };

  const handleSubmit = () => {
    if (hD !== true && hD !== false) {
      setHasError(true);
    } else {
      setHasError(false);
      dispatch(push(routes.LANDING));
    }
  };

  return (
    <div className="page hasDiploma">
      <IdeaHeader />
      <Progress value={40} />
      <Container>
        <Row>
          <Col xs="12">
            <h2>As tu déjà un diplôme en lien avec le métier de {job.label} ?</h2>
          </Col>
        </Row>
        <Row>
          <div className="buttons">
            <Container>
              <Row>
                <Col xs="6" className="radioButton">
                  <FormGroup check>
                    <Label
                      check
                      className={`btn ${hD === true ? "active" : ""}`}
                      onClick={() => {
                        handleChange(true);
                      }}
                    >
                      <Input
                        type="radio"
                        name="hasDiploma"
                        value="true"
                        onChange={() => handleChange(true)}
                        checked={hD === true}
                      />{" "}
                      Oui
                    </Label>
                  </FormGroup>
                </Col>
                <Col xs="6" className="radioButton">
                  <FormGroup check>
                    <Label
                      check
                      className={`btn ${hD === false ? "active" : ""}`}
                      onClick={() => {
                        handleChange(false);
                      }}
                    >
                      <Input
                        type="radio"
                        name="hasDiploma"
                        value="false"
                        onChange={() => handleChange(false)}
                        checked={hD === false}
                      />{" "}
                      Non
                    </Label>
                  </FormGroup>
                </Col>
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

export default DiplomaSelection;
