import React, { useState, useEffect } from "react";
import { IdeaHeader } from "../../components";
import { Container, Row, Col } from "reactstrap";
import "./trainingList.css";
import { LoadingResults } from "./components";
import fakeResult from "../../services/fakeResult.json";
import { useSwipeable } from "react-swipeable";
import { ReducedResultFilter, ResultNav, ResultList } from "./components";

const TrainingList = (props) => {
  const [loading, setLoading] = useState(true);

  const { jobs, trainings } = fakeResult;

  console.log("jobs ", jobs, "trainings ", trainings);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  });

  const slide = (dir) => {
    console.log("swipe : ", dir);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => slide("next"),
    onSwipedRight: () => slide("previous"),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div {...handlers} className="page trainingList">
      <IdeaHeader />
      {loading ? (
        <LoadingResults />
      ) : (
        <>
          <ReducedResultFilter />
          <Container>
            <Row>
              <Col xs="12">
                <ResultNav />
              </Col>
            </Row>
            <Row>
              <Col>
                <ResultList listType="training" trainings={trainings} />
              </Col>
            </Row>
            <Row>
              <Col>
                <ResultList listType="job" jobs={jobs} />
              </Col>
            </Row>
          </Container>
        </>
      )}
    </div>
  );
};

export default TrainingList;
