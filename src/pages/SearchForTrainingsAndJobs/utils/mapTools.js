import { map, getZoomLevelForDistance } from "../../../utils/mapTools";

const setJobMarkers = (jobs, map) => {
  let features = [];

  // positionnement des lbb
  if (jobs && jobs.lbbCompanies && jobs.lbbCompanies.companies_count) {
    jobs.lbbCompanies.companies.map((company, idx) => {
      company.ideaType = "lbb";
      features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [company.lon, company.lat],
        },
        properties: {
          id: "lbb-" + idx,
          job: company,
        },
      });
    });
  }

  // positionnement des lba
  if (jobs && jobs.lbaCompanies && jobs.lbaCompanies.companies_count) {
    jobs.lbaCompanies.companies.map((company, idx) => {
      company.ideaType = "lba";
      features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [company.lon, company.lat],
        },
        properties: {
          id: "lba-" + idx,
          job: company,
        },
      });
    });
  }

  // positionnement des marqueurs PE
  if (jobs && jobs.peJobs && jobs.peJobs.length) {
    jobs.peJobs.map((job, idx) => {
      if (job.lieuTravail && (job.lieuTravail.longitude || job.lieuTravail.latitude)) {
        job.ideaType = "peJob";
        features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [job.lieuTravail.longitude, job.lieuTravail.latitude],
          },
          properties: {
            id: "peJob-" + idx,
            job,
          },
        });
      }
    });
  }

  let results = { type: "FeatureCollection", features };

  map.getSource("job-points").setData(results);
};

const setTrainingMarkers = (trainingList) => {
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
};

export { setTrainingMarkers, setJobMarkers };
