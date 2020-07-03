import React from "react";
import distance from "@turf/distance";
import { Marker, MapPopup } from "../pages/SearchForTrainingsAndJobs/components";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import { Provider } from "react-redux";
import { fetchAddresses } from "../services/baseAdresse";
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

const flyToMarker = (item, zoom = map.getZoom()) => {
  if (item.type === "peJob") {
    // pe
    if (item.lieuTravail.longitude !== undefined)
      map.easeTo({ center: [item.lieuTravail.longitude, item.lieuTravail.latitude], speed: 0.2, zoom });
  } else if (item.type === "lbb" || item.type === "lba")
    // lbb / lba
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

const computeMissingPositionAndDistance = async (searchCenter, companies, source, map, store, showResultList) => {
  if (source === "pe") {
    // calcule et affectation aux offres PE de la distances du centre de recherche dans les cas où la donnée est incomplète

    await Promise.all(
      companies.map(async (company) => {
        if (
          company.lieuTravail &&
          !company.lieuTravail.longitude &&
          !company.lieuTravail.latitude &&
          company.lieuTravail.libelle
        ) {
          let place = company.lieuTravail.libelle; // complétion du numéro du département pour réduire les résultats erronés (ex : Saint Benoit à la réunion pour 86 - ST BENOIT)
          let dpt = place.substring(0, 2);
          dpt += "000";
          place = dpt + place.substring(2);

          const addresses = await fetchAddresses(place, "municipality"); // on force à Municipality pour ne pas avoir des rues dans de mauvaise localités

          if (addresses.length) {
            company.lieuTravail.longitude = addresses[0].value.coordinates[0];
            company.lieuTravail.latitude = addresses[0].value.coordinates[1];
            company.lieuTravail.distance =
              Math.round(10 * distance(searchCenter, [company.lieuTravail.longitude, company.lieuTravail.latitude])) /
              10;

            addJobMarkerIfPosition(company, map, store, showResultList);
          }
        }
      })
    );
  }

  return companies;
};

const addJobMarkerIfPosition = (job, map, store, showResultList) => {
  if (job.lieuTravail && (job.lieuTravail.longitude || job.lieuTravail.latitude))
    // certaines offres n'ont pas de lat / long
    currentMarkers.push(
      new mapboxgl.Marker(buildJobMarkerIcon(job))
        .setLngLat([job.lieuTravail.longitude, job.lieuTravail.latitude])
        .setPopup(new mapboxgl.Popup().setDOMContent(buildPopup(job, "peJob", store, showResultList)))
        .addTo(map)
    );
};

const buildJobMarkerIcon = (job) => {
  const markerNode = document.createElement("div");
  ReactDOM.render(<Marker type="job" flyToMarker={flyToMarker} item={job} />, markerNode);

  return markerNode;
};

export {
  map,
  currentMarkers,
  buildPopup,
  initializeMap,
  clearMarkers,
  flyToMarker,
  buildJobMarkerIcon,
  closeMapPopups,
  getZoomLevelForDistance,
  factorTrainingsForMap,
  computeMissingPositionAndDistance,
  addJobMarkerIfPosition,
};
