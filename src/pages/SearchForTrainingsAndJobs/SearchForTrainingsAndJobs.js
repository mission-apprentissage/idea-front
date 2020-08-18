import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import "./searchfortrainingsandjobs.css";

import { MapListSwitchButton, RightColumn } from "./components";
import { setSelectedItem, setItemToScrollTo } from "../../redux/Training/actions";
import { useDispatch, useSelector } from "react-redux";
import { map } from "../../utils/mapTools";
import Map from "../../components/Map";
import { gtag } from "../../services/googleAnalytics";

const SearchForTrainingsAndJobs = ({ isTrainingOnly }) => {
  const dispatch = useDispatch();

  const { selectedItem } = useSelector((state) => state.trainings);

  const [visiblePane, setVisiblePane] = useState("resultList");
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [hasSearch, setHasSearch] = useState(false); // booléen s'il y a un résultat de recherche

  const showSearchForm = (e) => {
    if (e) e.stopPropagation();
    setVisiblePane("resultList"); // affichage de la colonne resultList / searchForm
    setIsFormVisible(true);
    unSelectItem();
    gtag("Bouton", "Clic", "Affichage filtres");
  };

  const showResultMap = (e) => {
    if (e) e.stopPropagation();
    setVisiblePane("resultMap");

    // hack : force le redimensionnement de la carte qui peut n'occuper qu'une fraction de l'écran en mode mobile
    setTimeout(() => {
      map.resize();
    }, 50);

    gtag("Bouton", "Clic", "Affichage carte");
  };

  const showResultList = (e) => {
    if (e) e.stopPropagation();
    setVisiblePane("resultList");
    setIsFormVisible(false);
    gtag("Bouton", "Clic", "Affichage liste résultats");
  };

  const unSelectItem = () => {
    if (selectedItem) {
      dispatch(setSelectedItem(null));
      dispatch(setItemToScrollTo(selectedItem));
    }
  };

  return (
    <div className="page demoPage">
      <Row>
        <Col className={visiblePane === "resultMap" ? "activeXSPane" : "inactiveXSPane"} xs="12" md="8">
          <Map />
        </Col>
        <Col
          className={`leftShadow ${visiblePane === "resultList" ? "activeXSPane" : "inactiveXSPane"}`}
          xs="12"
          md="4"
        >
          <RightColumn
            showResultList={showResultList}
            showSearchForm={showSearchForm}
            isFormVisible={isFormVisible}
            setIsFormVisible={setIsFormVisible}
            setVisiblePane={setVisiblePane}
            visiblePane={visiblePane}
            setHasSearch={setHasSearch}
            hasSearch={hasSearch}
            unSelectItem={unSelectItem}
            isTrainingOnly={isTrainingOnly}
          />
        </Col>
      </Row>
      <MapListSwitchButton
        showSearchForm={showSearchForm}
        showResultMap={showResultMap}
        showResultList={showResultList}
        visiblePane={visiblePane}
        hasSearch={hasSearch}
      />
    </div>
  );
};

export default SearchForTrainingsAndJobs;
