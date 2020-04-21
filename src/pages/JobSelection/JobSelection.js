import React, { useState, useEffect } from "react";
import { IdeaHeader, JobAdvice } from "../../components";
import { Progress } from "reactstrap";
import { Container, Row, Col } from "reactstrap";
import { JobSelectionForm } from "./components";
import "./jobSelection.css";

const JobSelection = () => {
  return (
    <div className="page jobSelection">
      <IdeaHeader />
      <Progress value={20} />
      <Container>
        <Row>
          <Col xs="12">
            <h2>Ton projet c'est devenir ...</h2>
          </Col>
        </Row>
        <Row>
          <Col xs="12 form">
            <JobSelectionForm />
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
