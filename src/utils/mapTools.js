import React from "react";
import distance from "@turf/distance";
import { MapPopup } from "../pages/SearchForTrainingsAndJobs/components";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import { Provider } from "react-redux";

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
    touchZoomRotate: false,
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

// todo: affecter un type aux différents items pour effectuer un test propre
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

const clearMarkers = () => {
  for (let i = 0; i < currentMarkers.length; ++i) currentMarkers[i].remove();
  currentMarkers = [];
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

const getZoomLevelForDistance = (distance) => {
  let zoom = 10;

  if (distance > 10) {
    if (distance < 20) zoom = 9;
    else if (distance < 50) zoom = 8;
    else if (distance < 100) zoom = 7;
    else if (distance < 250) zoom = 6;
    else if (distance < 500) zoom = 5;
    else if (distance >= 500) zoom = 4;
  }

  return zoom;
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

const computeDistanceFromSearch = (searchCenter, companies, source) => {
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

export {
  map,
  currentMarkers,
  buildPopup,
  initializeMap,
  clearMarkers,
  flyToMarker,
  closeMapPopups,
  getZoomLevelForDistance,
  factorTrainingsForMap,
  computeDistanceFromSearch,
};
