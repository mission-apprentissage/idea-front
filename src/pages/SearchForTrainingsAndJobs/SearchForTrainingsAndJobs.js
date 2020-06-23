import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Row, Col } from "reactstrap";
import "./searchfortrainingsandjobs.css";
import baseUrl from "../../utils/baseUrl";
import { SearchForm, MapListSwitchButton } from "./components";
import ResultLists from "./components/ResultLists";
import { setTrainings, setJobs, setSelectedItem } from "../../redux/Training/actions";
import { useDispatch, useSelector, useStore } from "react-redux";
import ItemDetail from "../../components/ItemDetail/ItemDetail";
import { factorTrainingsForMap, computeDistanceFromSearch } from "../../utils/mapTools";
import { setJobMarkers, setTrainingMarkers } from "./utils/mapTools";
import { map, initializeMap, flyToMarker, closeMapPopups, clearMarkers } from "../../utils/mapTools";
import Map from "../../components/Map";

const formationsApi = baseUrl + "/formations";
const jobsApi = baseUrl + "/jobs";

const SearchForTrainingsAndJobs = () => {
  const store = useStore();
  const dispatch = useDispatch();
  const { trainings, jobs, selectedItem } = useSelector((state) => state.trainings);

  const [hasSearch, setHasSearch] = useState(false); // booléen s'il y a un résultat de recherche
  const [visiblePane, setVisiblePane] = useState("resultList");
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isTrainingSearchLoading, setIsTrainingSearchLoading] = useState(true);
  const [isJobSearchLoading, setIsJobSearchLoading] = useState(true);
  //const [selectedItem, setSelectedItem] = useState(null);

  const [searchRadius, setSearchRadius] = useState(30);

  let searchCenter;

  //const mapContainer = useRef(null);

  /*useEffect(() => {
    if (!map) initializeMap({ mapContainer });
  });*/

  /*const getMap = () => {
    return <div ref={(el) => (mapContainer.current = el)} className="mapContainer" />;
  };*/

  const handleSubmit = async (values) => {
    clearMarkers();
    // centrage de la carte sur le lieu de recherche
    searchCenter = [values.location.value.coordinates[0], values.location.value.coordinates[1]];

    setSearchRadius(values.radius || 30);

    map.flyTo({ center: searchCenter, zoom: 10 });

    setIsTrainingSearchLoading(true);
    setIsJobSearchLoading(true);

    try {
      searchForTrainings(values);
      searchForJobs(values);
      setIsFormVisible(false);
    } catch (err) {
      console.log("error loading data ", err); //TODO: faire un vrai traitement d'erreur
      setIsTrainingSearchLoading(false);
      setIsJobSearchLoading(false);
    }
  };

  const handleClose = () => {
    unSelectItem();
  };

  const unSelectItem = () => {
    if (selectedItem) dispatch(setSelectedItem(null));
  };

  const searchForTrainings = async (values) => {
    const response = await axios.get(formationsApi, {
      params: {
        romes: values.job.rome,
        longitude: values.location.value.coordinates[0],
        latitude: values.location.value.coordinates[1],
        radius: values.radius || 30,
        diploma: values.diploma,
      },
    });

    dispatch(setTrainings(response.data));

    setHasSearch(true);
    setIsFormVisible(false);
    setIsTrainingSearchLoading(false);

    if (response.data.length) setTrainingMarkers(factorTrainingsForMap(response.data), store, showResultList);
  };

  const searchForJobs = async (values) => {
    const response = await axios.get(jobsApi, {
      params: {
        romes: values.job.rome,
        longitude: values.location.value.coordinates[0],
        latitude: values.location.value.coordinates[1],
        insee: values.location.insee,
        zipcode: values.location.zipcode,
        radius: values.radius || 30,
      },
    });

    let results = {
      peJobs:
        response.data.peJobs !== "error"
          ? computeDistanceFromSearch(searchCenter, response.data.peJobs.resultats, "pe")
          : null,
      lbbCompanies: response.data.lbbCompanies,
    };

    dispatch(setJobs(results));

    setIsJobSearchLoading(false);

    setJobMarkers(results, map, store, showResultList);
  };

  const handleSelectItem = (item, type) => {
    flyToMarker(item, 12);
    closeMapPopups();
    dispatch(setSelectedItem({ item, type }));
  };

  const getResultLists = () => {
    return (
      <ResultLists
        hasSearch={hasSearch}
        isFormVisible={isFormVisible}
        selectedItem={selectedItem}
        handleSelectItem={handleSelectItem}
        showSearchForm={showSearchForm}
        isTrainingSearchLoading={isTrainingSearchLoading}
        isJobSearchLoading={isJobSearchLoading}
        searchRadius={searchRadius}
        trainings={trainings}
        jobs={jobs}
      />
    );
  };

  const getSearchForm = () => {
    return (
      <SearchForm
        isFormVisible={isFormVisible}
        selectedItem={selectedItem}
        hasSearch={hasSearch}
        showResultList={showResultList}
        handleSubmit={handleSubmit}
      />
    );
  };

  const getSelectedItemDetail = () => {
    return <ItemDetail selectedItem={selectedItem} handleClose={handleClose} />;
  };

  const showResultMap = (e) => {
    if (e) e.stopPropagation();
    setVisiblePane("resultMap");

    // hack : force le redimensionnement de la carte qui peut n'occuper qu'une fraction de l'écran en mode mobile
    setTimeout(() => {
      map.resize();
    }, 50);
  };

  const showResultList = (e) => {
    if (e) e.stopPropagation();
    setVisiblePane("resultList");
    setIsFormVisible(false);
  };

  const showSearchForm = (e) => {
    if (e) e.stopPropagation();
    setVisiblePane("resultList"); // affichage de la colonne resultList / searchForm
    setIsFormVisible(true);
    unSelectItem();
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
          <div className="rightCol">
            {getSearchForm()}
            {getResultLists()}
            {getSelectedItemDetail()}
          </div>
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
