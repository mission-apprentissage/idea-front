import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Row, Col } from "reactstrap";
import "./searchtraining.css";
import mapboxgl from "mapbox-gl";
import baseUrl from "../../utils/baseUrl";
import SearchForm from "./SearchForm";
import MapListSwitchButton from "./MapListSwitchButton";
import ResultLists from "./ResultLists";
import distance from "@turf/distance";
const formationsApi = baseUrl + "/formations";
const jobsApi = baseUrl + "/jobs";

let currentMarkers = [];

const SearchTraining = () => {
  const [trainings, setTrainings] = useState(null);
  const [jobs, setJobs] = useState(null);
  const [hasSearch, setHasSearch] = useState(false);
  //const [searchCenter, setSearchCenter] = useState(null);

  const [visiblePane, setVisiblePane] = useState("resultList");
  const [isFormVisible, setIsFormVisible] = useState(true);

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
    searchCenter = [values.location.value.coordinates[0], values.location.value.coordinates[1]];

    map.flyTo({ center: searchCenter, zoom:10 });

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

    if (response.data.length) setTrainingMarkers(factorTrainingsForMap(response.data));
  };

  const buildTrainingMarkerIcon = (trainingCount = 1) => {
    const el = document.createElement("div");
    el.className = `markerIcon trainingMarkerIcon`;
    if (trainingCount > 1) el.innerHTML = `<div>${trainingCount}</div>`;
    return el;
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

  const buildTrainingClusterPopup = (trainingCluster) => {
    const list = trainingCluster.trainings;
    let schoolInfo = `<div class="mapboxPopupTitle">Formations à : </div><div class="mapboxPopupAddress">${list[0].source.entreprise_raison_sociale.toLowerCase()}<br />${list[0].source.adresse.toLowerCase()}</div>`;
    let trainingInfo = "";
    for (let i = 0; i < list.length; ++i)
      trainingInfo += `<li>${list[i].source.nom ? list[i].source.nom : list[i].source.intitule_long}</li>`;
    return `${schoolInfo}<ul>${trainingInfo}</ul>`;
  };

  const setTrainingMarkers = (trainingList) => {
    // centrage sur formation la plus proche
    const centerCoords = trainingList[0].coords.split(","); 
    map.flyTo({ center: [centerCoords[1], centerCoords[0]], zoom: 10 });

    trainingList.map((training, idx) => {
      const coords = training.coords.split(",");

      currentMarkers.push(
        new mapboxgl.Marker(buildTrainingMarkerIcon(training.trainings.length))
          .setLngLat([coords[1], coords[0]])
          .setPopup(new mapboxgl.Popup().setHTML(buildTrainingClusterPopup(training)))
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

    let results = {
      peJobs: computeDistanceFromSearch(response.data.peJobs.resultats, "pe"),
      lbbCompanies: response.data.lbbCompanies,
    };

    setJobs(results);

    setJobMarkers(results);
  };

  const computeDistanceFromSearch = (companies, source) => {
    if (source === "pe") {
      // calcule et affectation aux offres PE de la distances du centre de recherche
      companies.map((company) => {
        if (company.lieuTravail)
          company.distance =
            Math.round(10 * distance(searchCenter, [company.lieuTravail.longitude, company.lieuTravail.latitude])) / 10;
      });
    }

    return companies;
  };

  const buildJobMarkerIcon = (withJob) => {
    const el = document.createElement("div");
    el.className = `markerIcon jobMarkerIcon`;
    if (withJob) el.innerHTML = "<div>1</div>";
    return el;
  };

  const setJobMarkers = (jobs) => {
    // positionnement des marqueurs bonne boîte

    if (jobs && jobs.lbbCompanies && jobs.lbbCompanies.companies_count) {
      jobs.lbbCompanies.companies.map((company, idx) => {
        currentMarkers.push(
          new mapboxgl.Marker(buildJobMarkerIcon())
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
          new mapboxgl.Marker(buildJobMarkerIcon("withJob"))
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
    return (
      <ResultLists
        hasSearch={hasSearch}
        isFormVisible={isFormVisible}
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

export default SearchTraining;
