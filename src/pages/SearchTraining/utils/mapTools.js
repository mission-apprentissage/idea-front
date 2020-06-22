import React from "react";
import { Marker, MapPopup } from "../components";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import { Provider } from "react-redux";
import { getZoomLevelForDistance } from "../../../utils/mapTools";

let currentMarkers = [];
let map = null;

const initializeMap = ({ mapContainer }) => {
  mapboxgl.accessToken = "pk.eyJ1IjoiYWxhbmxyIiwiYSI6ImNrYWlwYWYyZDAyejQzMHBpYzE0d2hoZWwifQ.FnAOzwsIKsYFRnTUwneUSA";

  /*lat: 47,    affichage centre France plus zoom France métropolitaine en entier
    lon: 2.2,
    zoom: 5,*/

  map = new mapboxgl.Map({
    container: mapContainer.current,
    style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
    center: [2.2, 47],
    zoom: 5,
    maxZoom: 15,
    minZoom: 3,
    dragRotate: false,
  });

  map.on("load", () => {
    map.resize();
  });

  map.on("move", () => {
    /*setMapState({
      lon: map.getCenter().lng.toFixed(4),
      lat: map.getCenter().lat.toFixed(4),
      zoom: map.getZoom().toFixed(2),
    });*/
  });

  const nav = new mapboxgl.NavigationControl({ showCompass: false, visualizePitch: false });
  map.addControl(nav, "top-right");
};

const flyToMarker = (item, zoom = map.getZoom()) => {
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

const setJobMarkers = (jobs, map, store, showResultList) => {
  // positionnement des marqueurs bonne boîte

  if (jobs && jobs.lbbCompanies && jobs.lbbCompanies.companies_count) {
    jobs.lbbCompanies.companies.map((company, idx) => {
      currentMarkers.push(
        new mapboxgl.Marker(buildJobMarkerIcon(company))
          .setLngLat([company.lon, company.lat])
          .setPopup(new mapboxgl.Popup().setDOMContent(buildPopup(company, "lbb", store, showResultList)))
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
            .setPopup(new mapboxgl.Popup().setDOMContent(buildPopup(job, "pe", store, showResultList)))
            .addTo(map)
        );
    });
  }
};

const clearMarkers = () => {
  for (let i = 0; i < currentMarkers.length; ++i) currentMarkers[i].remove();
  currentMarkers = [];
};

const buildJobMarkerIcon = (job) => {
  const markerNode = document.createElement("div");
  ReactDOM.render(<Marker type="job" flyToMarker={flyToMarker} item={job} />, markerNode);

  return markerNode;
};

const setTrainingMarkers = (trainingList, store, showResultList) => {
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
        .setPopup(new mapboxgl.Popup().setDOMContent(buildPopup(training, "training", store, showResultList)))
        .addTo(map)
    );
  });
};

const buildTrainingMarkerIcon = (training) => {
  const markerNode = document.createElement("div");
  ReactDOM.render(<Marker type="training" item={training} flyToMarker={flyToMarker} />, markerNode);

  return markerNode;
};

const buildPopup = (item, type, store, showResultList) => {
  const popupNode = document.createElement("div");

  ReactDOM.render(
    <Provider store={store}>
      <MapPopup handleSelectItem={showResultList} type={type} item={item} />
    </Provider>,
    popupNode
  );

  return popupNode;
};

const closeMapPopups = () => {
  currentMarkers.forEach((marker) => {
    if (marker.getPopup().isOpen()) marker.togglePopup();
  });
};

export { map, initializeMap, clearMarkers, setTrainingMarkers, setJobMarkers, flyToMarker, closeMapPopups };
