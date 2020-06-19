import distance from "@turf/distance";

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

export { getZoomLevelForDistance, factorTrainingsForMap, computeDistanceFromSearch };
