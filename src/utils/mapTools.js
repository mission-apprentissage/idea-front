import React from "react";
import distance from "@turf/distance";
import { Marker, MapPopup } from "../pages/SearchForTrainingsAndJobs/components";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import { Provider } from "react-redux";
import { fetchAddresses } from "../services/baseAdresse";
import { gtag } from "../services/googleAnalytics";
import { scrollToElementInContainer, getItemElement } from "./tools";
let currentPopup = null;
let map = null;

const initializeMap = ({ mapContainer, store, showResultList, unselectItem }) => {
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

  map.on("load", async () => {
    map.resize();

    map.loadImage("/pic/icons/school.png", function (error, image) {
      if (error) throw error;
      map.addImage("training", image);
    });

    map.loadImage("/pic/icons/job.png", function (error, image) {
      if (error) throw error;
      map.addImage("job", image);
    });

    // ajout layers et events liés aux jobs
    map.addSource("job-points", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50,
    });

    // Ajout de la layer des emplois en premier pour que les points soient en dessous des formations
    map.addLayer({
      id: "job-points-layer",
      source: "job-points",
      type: "symbol",
      layout: {
        "icon-image": "job", // cf. images chargées plus haut
        "icon-padding": 0,
        "icon-allow-overlap": true,
      },
    });

    map.on("click", "job-points-layer", function (e) {
      const features = e.features;
      setTimeout(() => {
        // setTimeout de 5 ms pour que l'event soit traité au niveau de la layer training et que le flag stop puisse être posé
        // en effet la layer job reçoit l'event en premier du fait de son positionnement dans la liste des layers de la map
        if (e && e.originalEvent) {
          if (!e.originalEvent.STOP) {
            e.features = features; // on réinsert les features de l'event qui sinon sont perdues en raison du setTimeout
            onLayerClick(e, "job", store, showResultList, unselectItem);
          }
        }
      }, 5);
    });

    // layer contenant les pastilles de compte des
    let clusterCountParams = {
      id: "job-points-cluster-count",
      source: "job-points",
      type: "symbol",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["Arial Unicode MS Bold"],
        "text-size": 14,
        "text-anchor": "top-left",
        "text-allow-overlap": true,
        "text-offset": [0.4, 0.2],
      },
      paint: {
        "text-color": "#fff",
        "text-halo-color": "#000",
        "text-halo-width": 3,
      },
    };
    map.addLayer(clusterCountParams);

    // ajout des layers et events liés aux formations
    map.addSource("training-points", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50,
    });

    // Ajout de la layer des formations
    map.addLayer({
      id: "training-points-layer",
      source: "training-points",
      type: "symbol",
      layout: {
        "icon-image": "training", // cf. images chargées plus haut
        "icon-padding": 0,
        "icon-allow-overlap": true,
      },
    });

    clusterCountParams.id = "training-points-cluster-count";
    clusterCountParams.source = "training-points";

    map.addLayer(clusterCountParams);

    map.on("click", "training-points-layer", function (e) {
      e.originalEvent.STOP = "STOP"; // un classique stopPropagation ne suffit pour empêcher d'ouvrir deux popups si des points de deux layers se superposent
      onLayerClick(e, "training", store, showResultList, unselectItem);
    });
  });

  /*map.on("move", () => {
    setMapState({
      lon: map.getCenter().lng.toFixed(4),
      lat: map.getCenter().lat.toFixed(4),
      zoom: map.getZoom().toFixed(2),
    });
  });*/

  // log vers google analytics de l'utilisation du bouton zoom / dézoom
  map.on("zoomend", (e) => {
    if (e.originalEvent) gtag("Bouton", "Clic", "Zoom", { niveauZoom: map.getZoom() });

    if (map.getZoom() < 9) closeMapPopups();
  });

  const nav = new mapboxgl.NavigationControl({ showCompass: false, visualizePitch: false });
  map.addControl(nav, "top-right");
};

const onLayerClick = (e, layer, store, showResultList, unselectItem) => {
  let coordinates = e.features[0].geometry.coordinates.slice();

  // si cluster on a properties: {cluster: true, cluster_id: 125, point_count: 3, point_count_abbreviated: 3}
  // sinon on a properties : { training|job }

  if (e.features[0].properties.cluster) {
    let zoom = map.getZoom();

    if (zoom > 11) zoom += 1;
    else if (zoom > 9) zoom += 2;
    else zoom += 3;

    map.easeTo({ center: coordinates, speed: 0.2, zoom });
  } else {
    let item =
      layer === "training" ? JSON.parse(e.features[0].properties.training) : JSON.parse(e.features[0].properties.job);

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    currentPopup = new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setDOMContent(buildPopup(item, item.ideaType, store, showResultList))
      .addTo(map);

    unselectItem();
    scrollToElementInContainer("rightColumn", getItemElement({ item, type: item.ideaType }), 50, "smooth");
  }
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
    const itemCoords = item.coords ? item.coords.split(",") : item.source.idea_geo_coordonnees_etablissement.split(",");
    map.easeTo({ center: [itemCoords[1], itemCoords[0]], speed: 0.2, zoom });
  }
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
  if (currentPopup) {
    currentPopup.remove();
    currentPopup = null;
  }
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

// rassemble les formations ayant lieu dans un même établissement pour avoir une seule icône sur la map
const factorTrainingsForMap = (list) => {
  let currentMarker = null;
  let resultList = [];
  for (let i = 0; i < list.length; ++i) {
    if (!currentMarker)
      currentMarker = { coords: list[i].source.idea_geo_coordonnees_etablissement, trainings: [list[i]] };
    else {
      if (currentMarker.coords !== list[i].source.idea_geo_coordonnees_etablissement) {
        resultList.push(currentMarker);
        currentMarker = { coords: list[i].source.idea_geo_coordonnees_etablissement, trainings: [list[i]] };
      } else currentMarker.trainings.push(list[i]);
    }
  }
  resultList.push(currentMarker);

  return resultList;
};

// rassemble les emplois ayant une même géoloc pour avoir une seule icône sur la map
const factorJobsForMap = (lists) => {
  let sortedList = [];

  // concaténation des trois sources d'emploi
  if (lists.peJobs) sortedList = lists.peJobs;

  if (lists.lbbCompanies)
    sortedList = sortedList.length ? sortedList.concat(lists.lbbCompanies.companies) : lists.lbbCompanies.companies;

  if (lists.lbaCompanies)
    sortedList = sortedList.length ? sortedList.concat(lists.lbaCompanies.companies) : lists.lbbCompanies.companies;

  // tri de la liste de tous les emplois selon les coordonnées geo (l'objectif est d'avoir les emplois au même lieu proches)
  sortedList.sort((a, b) => {
    const coordA = getFlatCoords(a);
    const coordB = getFlatCoords(b);

    if (coordA < coordB) return -1;
    else return 1;
  });

  // réduction de la liste en rassemblant les emplois au même endroit sous un seul item
  let currentMarker = null;
  let resultList = [];

  for (let i = 0; i < sortedList.length; ++i) {
    let coords = getCoordsFromJob(sortedList[i]);

    if (!currentMarker) currentMarker = { coords, jobs: [sortedList[i]] };
    else {
      if (!isEqualCoords(currentMarker.coords, coords)) {
        resultList.push(currentMarker);
        currentMarker = { coords, jobs: [sortedList[i]] };
      } else currentMarker.jobs.push(sortedList[i]);
    }
  }

  if (currentMarker) resultList.push(currentMarker);

  return resultList;
};

// en entrée tableaux [lon,lat]
const isEqualCoords = (coordsA, coordsB) => {
  if (coordsA && coordsB && coordsA[0] === coordsB[0] && coordsA[1] === coordsB[1]) return true;
  else return false;
};

const getCoordsFromJob = (item) => {
  let coords = null;
  if (item.type === "lba" || item.type === "lbb") coords = [item.lon, item.lat];
  else {
    // peJob
    if (item.lieuTravail.longitude !== undefined) coords = [item.lieuTravail.longitude, item.lieuTravail.latitude];
  }

  return coords;
};

// utile uniquement pour le tri par coordonnées
const getFlatCoords = (item) => {
  const coords = getCoordsFromJob(item);

  return coords ? "" + coords[0] + "," + coords[1] : null;
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
          }
        }
      })
    );
  }

  return companies;
};

const buildJobMarkerIcon = (job) => {
  const markerNode = document.createElement("div");
  ReactDOM.render(<Marker type="job" flyToMarker={flyToMarker} item={job} />, markerNode);

  return markerNode;
};

const filterLayers = (filter) => {
  let layersToShow = [];
  let layersToHide = [];
  if (filter === "all")
    layersToShow = [
      "training-points-cluster-count",
      "training-points-layer",
      "job-points-cluster-count",
      "job-points-layer",
    ];
  if (filter === "jobs") {
    layersToShow = ["job-points-cluster-count", "job-points-layer"];
    layersToHide = ["training-points-cluster-count", "training-points-layer"];
  }
  if (filter === "trainings") {
    layersToHide = ["job-points-cluster-count", "job-points-layer"];
    layersToShow = ["training-points-cluster-count", "training-points-layer"];
  }

  layersToHide.map((layerId) => {
    map.setLayoutProperty(layerId, "visibility", "none");
  });
  layersToShow.map((layerId) => {
    map.setLayoutProperty(layerId, "visibility", "visible");
  });
};

export {
  map,
  buildPopup,
  initializeMap,
  flyToMarker,
  buildJobMarkerIcon,
  closeMapPopups,
  getZoomLevelForDistance,
  factorTrainingsForMap,
  factorJobsForMap,
  computeMissingPositionAndDistance,
  filterLayers,
};
