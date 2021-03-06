import React from "react";
import { IdeaTitle } from "../../components";
import { Container, Row, Col, Button } from "reactstrap";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import routes from "../../routes.json";
import { gtag } from "../../services/googleAnalytics";
import "./landing.css";

const Landing = () => {
  const dispatch = useDispatch();

  return (
    <div className="page landing">
      <Container>
        <Row>
          <Col xs="12">
            <IdeaTitle />
            <h2>Trouve la formation et l'entreprise pour réaliser ton projet !</h2>
          </Col>
        </Row>
        <Row>
          <Col xs="12 cta">
            <div className="cta">
              <Button
                onClick={() => {
                  gtag("tunnelNextStep", "landing", "");
                  dispatch(push(routes.JOBSELECTION));
                }}
              >
                C'est parti !
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Landing;
