import { map, getZoomLevelForDistance } from "../../../utils/mapTools";

const setJobMarkers = (jobList) => {
  let features = [];
  jobList.map((job, idx) => {
    job.ideaType = "job";
    features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: job.coords,
      },
      properties: {
        id: idx,
        job,
      },
    });
  });

  let results = { type: "FeatureCollection", features };

  map.getSource("job-points").setData(results);
};

const setTrainingMarkers = (trainingList) => {
  if (trainingList) {
    // centrage sur formation la plus proche
    const centerCoords = trainingList[0].coords.split(",");

    let newZoom = getZoomLevelForDistance(trainingList[0].trainings[0].sort[0]);

    map.flyTo({ center: [centerCoords[1], centerCoords[0]], zoom: newZoom });

    let features = [];

    trainingList.map((training, idx) => {
      const coords = training.coords.split(",");

      training.ideaType = "training";
      features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [coords[1], coords[0]],
        },
        properties: {
          id: idx,
          training,
        },
      });
    });

    let results = { type: "FeatureCollection", features };

    map.getSource("training-points").setData(results);
  } else {
    map.getSource("training-points").setData({ type: "FeatureCollection", features: [] });
  }
};

export { setTrainingMarkers, setJobMarkers };
