import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Row, Col } from "reactstrap";
import "./searchtraining.css";
import baseUrl from "../../utils/baseUrl";
import { SearchForm, MapListSwitchButton } from "./components";
import ResultLists from "./components/ResultLists";
import { setTrainings, setJobs, setSelectedItem } from "../../redux/Training/actions";
import { useDispatch, useSelector, useStore } from "react-redux";
import ItemDetail from "../../components/ItemDetail/ItemDetail";
import { factorTrainingsForMap, computeDistanceFromSearch } from "../../utils/mapTools";
import {
  map,
  initializeMap,
  clearMarkers,
  setJobMarkers,
  setTrainingMarkers,
  flyToMarker,
  closeMapPopups,
} from "./utils/mapTools";

const formationsApi = baseUrl + "/formations";
const jobsApi = baseUrl + "/jobs";

//let currentMarkers = [];

const SearchTraining = () => {
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
  /*const [map, setMap] = useState(null);
  const [mapState, setMapState] = useState({
    lat: 47,
    lon: 2.2,
    zoom: 5,
  });*/

  let searchCenter;

  const mapContainer = useRef(null);

  useEffect(() => {
    if (!map) initializeMap({ mapContainer });
  });

  const getMap = () => {
    return <div ref={(el) => (mapContainer.current = el)} className="mapContainer" />;
  };

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

  /*const buildTrainingMarkerIcon = (training) => {
    const markerNode = document.createElement("div");
    ReactDOM.render(<Marker type="training" item={training} flyToMarker={flyToMarker} />, markerNode);

    return markerNode;
  };*/

  /*const setTrainingMarkers = (trainingList) => {
    // centrage sur formation la plus proche
    const centerCoords = trainingList[0].coords.split(",");

    let newZoom = getZoomLevelForDistance(trainingList[0].trainings[0].sort[0]);

    //setTimeout(() => {map.flyTo({ center: [centerCoords[1], centerCoords[0]], zoom: newZoom })},2500);
    map.flyTo({ center: [centerCoords[1], centerCoords[0]], zoom: newZoom });

    trainingList.map((training, idx) => {
      const coords = training.coords.split(",");

      currentMarkers.push(
        //new mapboxgl.Marker(buildTrainingMarkerIcon(training.trainings.length))
        new mapboxgl.Marker(buildTrainingMarkerIcon(training))
          .setLngLat([coords[1], coords[0]])
          //.setPopup(new mapboxgl.Popup().setHTML(buildTrainingClusterPopup(training)))
          .setPopup(new mapboxgl.Popup().setDOMContent(buildPopup(training, "training")))
          .addTo(map)
      );
    });
  };*/

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

  /*const flyToMarker = (item, zoom = map.getZoom()) => {
    if (item.lieuTravail) {
      // pe
      if (item.lieuTravail.longitude !== undefined)
        map.easeTo({ center: [item.lieuTravail.longitude, item.lieuTravail.latitude], speed: 0.2, zoom });
    } else if (item.siret)
      // lbb
      map.easeTo({ center: [item.lon, item.lat], speed: 0.2, zoom });
    // formation
    else {
      // l'item peut être un aggrégat de formations ou une formation seule d'où les deux accès différents aux geo points
      const itemCoords = item.coords
        ? item.coords.split(",")
        : item.source.geo_coordonnees_etablissement_reference.split(",");
      map.easeTo({ center: [itemCoords[1], itemCoords[0]], speed: 0.2, zoom });
    }
  };*/

  /*const buildJobMarkerIcon = (job) => {
    const markerNode = document.createElement("div");
    ReactDOM.render(<Marker type="job" flyToMarker={flyToMarker} item={job} />, markerNode);

    return markerNode;
  };*/

  /*const buildPopup = (item, type) => {
    const popupNode = document.createElement("div");
    ReactDOM.render(
      <Provider store={store}>
        <MapPopup handleSelectItem={showResultList} type={type} item={item} />
      </Provider>,
      popupNode
    );

    return popupNode;
  };*/

  /*const setJobMarkers = (jobs) => {
    // positionnement des marqueurs bonne boîte

    if (jobs && jobs.lbbCompanies && jobs.lbbCompanies.companies_count) {
      jobs.lbbCompanies.companies.map((company, idx) => {
        currentMarkers.push(
          new mapboxgl.Marker(buildJobMarkerIcon(company))
            .setLngLat([company.lon, company.lat])
            .setPopup(new mapboxgl.Popup().setDOMContent(buildPopup(company, "lbb")))
            .addTo(map)
        );
      });
    }

    // positionnement des marqueurs PE
    if (jobs && jobs.peJobs && jobs.peJobs.length) {
      jobs.peJobs.map((job, idx) => {
        if (job.lieuTravail && job.lieuTravail.longitude !== undefined)
          // certaines offres n'ont pas de lat / long
          currentMarkers.push(
            new mapboxgl.Marker(buildJobMarkerIcon(job))
              .setLngLat([job.lieuTravail.longitude, job.lieuTravail.latitude])
              .setPopup(new mapboxgl.Popup().setDOMContent(buildPopup(job, "pe")))
              .addTo(map)
          );
      });
    }
  };*/

  const handleSelectItem = (item, type) => {
    flyToMarker(item, 12);
    closeMapPopups();
    dispatch(setSelectedItem({ item, type }));
  };

  /*const closeMapPopups = () => {
    currentMarkers.forEach((marker) => {
      if (marker.getPopup().isOpen()) marker.togglePopup();
    });
  };*/

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
          <div className="mapContainer">{getMap()}</div>
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

export default SearchTraining;
