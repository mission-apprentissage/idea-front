import React, { useState } from "react";
import axios from "axios";
import { IdeaHeader } from "../../components";
import { Button, Container, Row, Col, FormGroup, Label, Input } from "reactstrap";
import "./apitester.css";


const baseUrl = window.location.hostname==="localhost"?"http://localhost:3000":"https://idea-mna-api.herokuapp.com";

const formationApi = baseUrl+"/formation";
const romesApi = baseUrl+"/romes";
const romeLabelsApi = baseUrl+"/romelabels";

const ApiTester = () => {
  const [tD, setTD] = useState(null);
  const [hasError, setHasError] = useState(null);

  const handleChange = (response) => {
    setTD(response);
    setHasError(null);
  };

  const fetchTrainings = async () =>
  {
      const trainings = await fetch()
  }

  const handleSubmit = async () => {
    
    const response = await axios.get(formationApi, { params: { romes : "D1101" } });

    console.log(response);

  };

  return (
    <div className="page trainingDuration">
      <IdeaHeader />
      <Container>
        <Row>
          <Col xs="12">
            <h2>Formulaire de test des APIs IDEA?</h2>
          </Col>
        </Row>
        <Row>
          <div xs="12" sm="6" md="3">
            <Container>
              <Row>
                <div>Filtre A</div>

                <Button type="submit" onClick={handleSubmit}>
                  Valider
                </Button>
              </Row>
            </Container>
          </div>
          <div xs="12" sm="6" md="3">
            Résultat
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default ApiTester;
