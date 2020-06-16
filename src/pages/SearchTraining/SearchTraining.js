import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { Row, Col } from "reactstrap";
import "./searchtraining.css";
import mapboxgl from "mapbox-gl";
import baseUrl from "../../utils/baseUrl";
import SearchForm from "./SearchForm";
import MapListSwitchButton from "./MapListSwitchButton";
import ResultLists from "./ResultLists";
import distance from "@turf/distance";
import { setTrainings, setJobs, setSelectedItem } from "../../redux/Training/actions";
import { useDispatch, useSelector, useStore, Provider } from "react-redux";
import Marker from "./Marker";
import MapPopup from "./MapPopup";
import ItemDetail from "./ItemDetail";

const formationsApi = baseUrl + "/formations";
const jobsApi = baseUrl + "/jobs";

let currentMarkers = [];

const SearchTraining = () => {
  const store = useStore();
  const dispatch = useDispatch();
  const { trainings, jobs, selectedItem } = useSelector((state) => state.trainings);

  const [hasSearch, setHasSearch] = useState(false); // booléen s'il y a un résultat de recherche
  const [visiblePane, setVisiblePane] = useState("resultList");
  const [isFormVisible, setIsFormVisible] = useState(true);
  //const [selectedItem, setSelectedItem] = useState(null);

  const [map, setMap] = useState(null);
  const [mapState, setMapState] = useState({
    lat: 48.85341,
    lon: 2.3488,
    zoom: 10,
  });

  let searchCenter;

  const mapContainer = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1IjoiYWxhbmxyIiwiYSI6ImNrYWlwYWYyZDAyejQzMHBpYzE0d2hoZWwifQ.FnAOzwsIKsYFRnTUwneUSA";

    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
        center: [mapState.lon, mapState.lat],
        zoom: mapState.zoom,
        maxZoom: 15,
        minZoom: 5,
        dragRotate: false,
      });

      map.on("load", () => {
        setMap(map);
        map.resize();
      });

      map.on("move", () => {
        setMapState({
          lon: map.getCenter().lng.toFixed(4),
          lat: map.getCenter().lat.toFixed(4),
          zoom: map.getZoom().toFixed(2),
        });
      });

      const nav = new mapboxgl.NavigationControl({ showCompass: false, visualizePitch: false });
      map.addControl(nav, "top-right");
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map, mapState.lon, mapState.lat, mapState.zoom]);

  const getMap = () => {
    return <div ref={(el) => (mapContainer.current = el)} className="mapContainer" />;
  };

  const clearMarkers = () => {
    for (let i = 0; i < currentMarkers.length; ++i) currentMarkers[i].remove();

    currentMarkers = [];
  };

  const handleSubmit = async (values) => {
    clearMarkers();
    // centrage de la carte sur le lieu de recherche
    searchCenter = [values.location.value.coordinates[0], values.location.value.coordinates[1]];

    /*let zoom = map.getZoom();
    let radius = values.radius || 30;
    if(radius<=30)
      zoom = 10;
    else if(radius<100)
      zoom = 8;
    else
      zoom = 7;*/

    map.flyTo({ center: searchCenter, zoom: 10 });

    searchForTrainings(values);
    searchForJobs(values);
    setIsFormVisible(false);
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

    if (response.data.length) setTrainingMarkers(factorTrainingsForMap(response.data));
  };

  const buildTrainingMarkerIcon = (training) => {
    const markerNode = document.createElement("div");
    ReactDOM.render(<Marker type="training" item={training} flyToMarker={flyToMarker} />, markerNode);

    return markerNode;
  };

  // fabrique des clusters de formations
  const factorTrainingsForMap = (list) => {
    let currentMarker = null;
    let resultList = [];
    for (let i = 0; i < list.length; ++i) {
      if (!currentMarker)
        currentMarker = { coords: list[i].source.geo_coordonnees_etablissement_reference, trainings: [list[i]] };
      else {
        if (currentMarker.coords !== list[i].source.geo_coordonnees_etablissement_reference) {
          resultList.push(currentMarker);
          currentMarker = { coords: list[i].source.geo_coordonnees_etablissement_reference, trainings: [list[i]] };
        } else currentMarker.trainings.push(list[i]);
      }
    }
    resultList.push(currentMarker);
    return resultList;
  };

  const setTrainingMarkers = (trainingList) => {
    // centrage sur formation la plus proche
    const centerCoords = trainingList[0].coords.split(",");
    map.flyTo({ center: [centerCoords[1], centerCoords[0]], zoom: 10 });

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
      peJobs: response.data.peJobs !== "error" ? computeDistanceFromSearch(response.data.peJobs.resultats, "pe") : null,
      lbbCompanies: response.data.lbbCompanies,
    };

    dispatch(setJobs(results));

    setJobMarkers(results);
  };

  const computeDistanceFromSearch = (companies, source) => {
    if (source === "pe") {
      // calcule et affectation aux offres PE de la distances du centre de recherche
      companies.map((company) => {
        if (company.lieuTravail && company.lieuTravail.longitude !== undefined)
          company.distance =
            Math.round(10 * distance(searchCenter, [company.lieuTravail.longitude, company.lieuTravail.latitude])) / 10;
      });
    }

    return companies;
  };

  const flyToMarker = (item, zoom = map.getZoom()) => {
    //console.log("item flyToMarker : ", item);

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
  };

  const buildJobMarkerIcon = (job) => {
    const markerNode = document.createElement("div");
    ReactDOM.render(<Marker type="job" flyToMarker={flyToMarker} item={job} />, markerNode);

    return markerNode;
  };

  const buildPopup = (item, type) => {
    const popupNode = document.createElement("div");
    ReactDOM.render(
      <Provider store={store}>
        <MapPopup handleSelectItem={showResultList} type={type} item={item} />
      </Provider>,
      popupNode
    );

    return popupNode;
  };

  const setJobMarkers = (jobs) => {
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
  };

  const handleSelectItem = (item, type) => {
    flyToMarker(item, 12);
    closeMapPopups();
    dispatch(setSelectedItem({ item, type }));
  };

  const closeMapPopups = () => {
    currentMarkers.forEach((marker) => {
      if (marker.getPopup().isOpen()) marker.togglePopup();
    });
  };

  const getResultLists = () => {
    return (
      <ResultLists
        hasSearch={hasSearch}
        isFormVisible={isFormVisible}
        selectedItem={selectedItem}
        handleSelectItem={handleSelectItem}
        showSearchForm={showSearchForm}
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
