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
  const [openedItem, setOpenedItem] = useState(null);

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

  const handleOpenedItem = (id) => {
    setOpenedItem(id);
    if (id) {
      setTimeout(() => {
        document.getElementById(id).scrollIntoView();
        setTimeout(() => {
          window.scrollBy(0, -150);
        }, 0);
      }, 250);
    }
  };

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
                <ResultList
                  listType="training"
                  trainings={trainings}
                  handleOpenedItem={handleOpenedItem}
                  openedItem={openedItem}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <ResultList listType="job" jobs={jobs} handleOpenedItem={handleOpenedItem} openedItem={openedItem} />
              </Col>
            </Row>
          </Container>
        </>
      )}
    </div>
  );
};

export default TrainingList;
