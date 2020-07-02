import React from "react";
import { Marker } from "../components";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import {
  map,
  currentMarkers,
  buildPopup,
  flyToMarker,
  getZoomLevelForDistance,
  addJobMarkerIfPosition,
  buildJobMarkerIcon,
} from "../../../utils/mapTools";

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
      addJobMarkerIfPosition(job, map, store, showResultList);
    });
  }
};

const setTrainingMarkers = (trainingList, store, showResultList) => {
  // centrage sur formation la plus proche
  const centerCoords = trainingList[0].coords.split(",");

  let newZoom = getZoomLevelForDistance(trainingList[0].trainings[0].sort[0]);

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

export { setTrainingMarkers, setJobMarkers };
