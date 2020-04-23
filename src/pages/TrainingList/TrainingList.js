import React, { useState, useEffect } from "react";
import { IdeaHeader } from "../../components";
import { Container, Row, Col, Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import routes from "../../routes.json";
import "./trainingList.css";
import { LoadingResults } from "./components";
import fakeResult from "../../services/fakeResult.json";
import { setResults } from "../../redux/Training/actions";
import { ReducedResultFilter, ResultNav, ResultList } from "./components";

const TrainingList = (props) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const { jobs, trainings } = fakeResult;

  console.log("jobs ", jobs, "trainings ", trainings);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  });

  return (
    <div className="page trainingList">
      <IdeaHeader />
      {loading ? (
        <LoadingResults />
      ) : (
        <>
          <ReducedResultFilter />
          <Container className="">
            <Row>
              <Col xs="12">
                <ResultNav />
              </Col>
            </Row>
            <Row>
              <Col>
                <ResultList listType="training" />
              </Col>
            </Row>
            <Row>
              <Col>
                <ResultList listType="job" />
              </Col>
            </Row>
          </Container>
        </>
      )}
    </div>
  );
};

export default TrainingList;
