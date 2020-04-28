import React, { useState, useEffect } from "react";
import { IdeaHeader } from "../../components";
import { Container, Row, Col } from "reactstrap";
import "./trainingList.css";
import { LoadingResults } from "./components";
import { useSelector } from "react-redux";
import fakeResultMacon from "../../services/fakeResultMacon.json";
import fakeResultBoucher from "../../services/fakeResultBoucher.json";
import { useSwipeable } from "react-swipeable";
import { ReducedResultFilter, ResultNav, ResultList } from "./components";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import routes from "../../routes.json";

const getRank = (props) => {
  let rank = props.match.params.rank;
  if (rank) {
    try {
      if (rank.charAt(0) === "#") rank = rank.substring(1);
      rank = parseInt(rank);

      if (rank < 0 || rank > 1) rank = 0;
    } catch (err) {
      rank = 0;
    }
  } else rank = 0;

  return rank;
};

const TrainingList = (props) => {
  const dispatch = useDispatch();

  const rank = getRank(props);

  const [loading, setLoading] = useState(true);
  const [openedItem, setOpenedItem] = useState(null);

  const { job } = useSelector((state) => state.filters);

  //console.log("job : ",job);
  const { trainings } = job && job.label && job.label.toLowerCase() === "boucher" ? fakeResultBoucher : fakeResultMacon;

  //console.log("trainings ", trainings);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  });

  // note : quick n dirty
  const goToPreviousTraining = () => {
    if (rank === 1) dispatch(push(routes.TRAININGLIST + "/0"));
  };

  const goToNextTraining = () => {
    if (rank === 0) dispatch(push(routes.TRAININGLIST + "/1"));
  };

  const slide = (dir) => {
    if (dir === "next") goToNextTraining();
    else goToPreviousTraining();
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
                <ResultNav
                  goToPreviousTraining={goToPreviousTraining}
                  goToNextTraining={goToNextTraining}
                  rank={rank}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <ResultList
                  listType="training"
                  training={trainings[rank]}
                  handleOpenedItem={handleOpenedItem}
                  openedItem={openedItem}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <ResultList
                  listType="job"
                  jobs={trainings[rank].jobs}
                  handleOpenedItem={handleOpenedItem}
                  openedItem={openedItem}
                />
              </Col>
            </Row>
          </Container>
        </>
      )}
    </div>
  );
};

export default TrainingList;
