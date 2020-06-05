import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Row, Col } from "reactstrap";
import "./searchdemo.css";
import mapboxgl from "mapbox-gl";
import baseUrl from "../../utils/baseUrl";
import SearchForm from "./SearchForm";
import MapListSwitchButton from "./MapListSwitchButton";
import ResultLists from "./ResultLists";

const formationsApi = baseUrl + "/formations";
const jobsApi = baseUrl + "/jobs";

let currentMarkers = [];

const SearchDemo = () => {
  const [trainings, setTrainings] = useState(null);
  const [jobs, setJobs] = useState(null);
  const [hasSearch, setHasSearch] = useState(false);

  const [visiblePane, setVisiblePane] = useState("resultList");
  const [isFormVisible, setIsFormVisible] = useState(true);

  const [map, setMap] = useState(null);
  const [mapState, setMapState] = useState({
    lat: 48.85341,
    lon: 2.3488,
    zoom: 8,
  });

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
  }, [map]);

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
    map.easeTo({ center: [values.location.value.coordinates[0], values.location.value.coordinates[1]] });

    searchForTrainings(values);
    searchForJobs(values);
    setIsFormVisible(false);
  };

  const searchForTrainings = async (values) => {
    const response = await axios.get(formationsApi, {
      params: {
        romes: values.job.rome,
        longitude: values.location.value.coordinates[0],
        latitude: values.location.value.coordinates[1],
      },
    });
    setTrainings(response.data);

    setHasSearch(true);
    setIsFormVisible(false);

    setTrainingMarkers(response.data);
  };

  const setTrainingMarkers = (trainingList) => {
    trainingList.map((training, idx) => {
      const coords = training.source.geo_coordonnees_etablissement_reference.split(",");

      currentMarkers.push(
        new mapboxgl.Marker()
          .setLngLat([coords[1], coords[0]])
          .setPopup(new mapboxgl.Popup().setHTML(`${training.source.intitule_long}<br />${training.source.diplome}`))
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
      },
    });

    let results = { peJobs: response.data.peJobs.resultats, lbbCompanies: response.data.lbbCompanies };

    setJobs(results);

    setJobMarkers(results);
  };

  const setJobMarkers = (jobs) => {
    // positionnement des marqueurs bonne boîte
    if (jobs && jobs.lbbCompanies && jobs.lbbCompanies.companies_count) {
      jobs.lbbCompanies.companies.map((company, idx) => {
        currentMarkers.push(
          new mapboxgl.Marker({ color: "red" })
            .setLngLat([company.lon, company.lat])
            .setPopup(new mapboxgl.Popup().setHTML(`${company.name}<br />${company.address}`))
            .addTo(map)
        );
      });
    }

    // positionnement des marqueurs PE
    if (jobs && jobs.peJobs && jobs.peJobs.length) {
      jobs.peJobs.map((job, idx) => {
        currentMarkers.push(
          new mapboxgl.Marker({ color: "green" })
            .setLngLat([job.lieuTravail.longitude, job.lieuTravail.latitude])
            .setPopup(
              new mapboxgl.Popup().setHTML(
                `${job.intitule}<br />${job.entreprise ? job.entreprise.nom : ""}<br />${job.lieuTravail.libelle}`
              )
            )
            .addTo(map)
        );
      });
    }
  };

  const getResultLists = () => {
    return <ResultLists hasSearch={hasSearch} isFormVisible={isFormVisible} trainings={trainings} jobs={jobs} />;
  };

  const getSearchForm = () => {
    return (
      <SearchForm
        isFormVisible={isFormVisible}
        hasSearch={hasSearch}
        showResultList={showResultList}
        handleSubmit={handleSubmit}
      />
    );
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
    console.log("ICIC");
    if (e) e.stopPropagation();
    setVisiblePane("resultList");
    setIsFormVisible(false);
  };

  const showSearchForm = (e) => {
    if (e) e.stopPropagation();
    setVisiblePane("resultList"); // affichage de la colonne resultList / searchForm
    setIsFormVisible(true);
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
            lat : {mapState.lat} - long : {mapState.lon} - zoom : {mapState.zoom}
            <br />
            {getSearchForm()}
            {getResultLists()}
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

export default SearchDemo;
