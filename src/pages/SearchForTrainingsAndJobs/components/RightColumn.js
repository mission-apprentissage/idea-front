import React, { useState, useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import axios from "axios";
import distance from "@turf/distance";
import baseUrl from "../../../utils/baseUrl";
import { scrollToTop } from "../../../utils/tools";
import ItemDetail from "../../../components/ItemDetail/ItemDetail";
import { setJobMarkers, setTrainingMarkers } from "../utils/mapTools";
import SearchForm from "./SearchForm";
import ResultLists from "./ResultLists";
import {
  setTrainings,
  setJobs,
  setSelectedItem,
  setItemToScrollTo,
  setFormValues,
  setExtendedSearch,
} from "../../../redux/Training/actions";
import {
  map,
  flyToMarker,
  closeMapPopups,
  clearMarkers,
  clearJobMarkers,
  factorTrainingsForMap,
  computeMissingPositionAndDistance,
} from "../../../utils/mapTools";
import { fetchAddresses } from "../../../services/baseAdresse";

const trainingsApi = baseUrl + "/formations";
const jobsApi = baseUrl + "/jobs";

const RightColumn = ({
  showResultList,
  unSelectItem,
  showSearchForm,
  setHasSearch,
  hasSearch,
  isFormVisible,
  setIsFormVisible,
  isTrainingOnly,
}) => {
  const dispatch = useDispatch();

  const store = useStore();

  const { trainings, jobs, selectedItem, itemToScrollTo, formValues } = useSelector((state) => state.trainings);
  const [isTrainingSearchLoading, setIsTrainingSearchLoading] = useState(true);
  const [isJobSearchLoading, setIsJobSearchLoading] = useState(true);
  const [searchRadius, setSearchRadius] = useState(30);
  const [jobSearchError, setJobSearchError] = useState("");
  const [trainingSearchError, setTrainingSearchError] = useState("");

  useEffect(() => {
    if (itemToScrollTo) {
      const itemElement = getItemElement(itemToScrollTo);

      if (itemElement) {
        document.getElementById("rightColumn").scrollTo({
          top: itemElement.offsetTop - 50,
          left: 0,
        });
        dispatch(setItemToScrollTo(null));
      }
    }
  });

  const getItemElement = (item) => {
    let id = "";

    if (item.type === "lbb") id = `${item.item.type}${item.item.siret}`;
    else if (item.type === "training") id = `id${item.item.id}`;
    else if (item.type === "peJob") id = `id${item.item.id}`;

    let res = document.getElementById(id);

    return res;
  };

  const handleSelectItem = (item, type) => {
    flyToMarker(item, 12);
    closeMapPopups();
    dispatch(setSelectedItem({ item, type }));
  };

  const handleClose = () => {
    unSelectItem();
  };

  const handleSubmit = async (values) => {
    clearMarkers();
    // centrage de la carte sur le lieu de recherche
    const searchCenter = [values.location.value.coordinates[0], values.location.value.coordinates[1]];

    setSearchRadius(values.radius || 30);
    dispatch(setExtendedSearch(false));

    map.flyTo({ center: searchCenter, zoom: 10 });

    searchForTrainings(values);
    if (!isTrainingOnly) {
      dispatch(setFormValues({ ...values }));
      searchForJobsWithStrictRadius(values);
    }

    setIsFormVisible(false);
  };

  const searchForJobsOnNewCenter = async (newCenter) => {
    searchOnNewCenter(newCenter, null, "jobs");
  };

  const searchForTrainingsOnNewCenter = async (newCenter) => {
    searchOnNewCenter(newCenter, "trainings", null);
  };

  const searchOnNewCenter = async (newCenter, isTrainingSearch, isJobSearch) => {
    if (isJobSearch) clearJobMarkers();
    else clearMarkers();

    dispatch(setExtendedSearch(false));

    scrollToTop("rightColumn");

    formValues.location = newCenter;

    dispatch(setFormValues(formValues));

    // mise à jour des infos de distance des formations par rapport au nouveau centre de recherche
    if (isJobSearch) updateTrainingDistanceWithNewCenter(formValues.location.value.coordinates);

    map.flyTo({ center: formValues.location.value.coordinates, zoom: 10 });

    searchForJobsWithStrictRadius(formValues);

    if (isTrainingSearch) searchForTrainings(formValues);
  };

  const updateTrainingDistanceWithNewCenter = (coordinates) => {
    for (let i = 0; i < trainings.length; ++i) {
      const trainingCoords = trainings[i].source.idea_geo_coordonnees_etablissement.split(",");
      trainings[i].sort[0] = Math.round(10 * distance(coordinates, [trainingCoords[1], trainingCoords[0]])) / 10;
    }
    dispatch(setTrainings(trainings));
  };

  const searchForTrainings = async (values) => {
    setIsTrainingSearchLoading(true);
    setTrainingSearchError("");
    try {
      const response = await axios.get(trainingsApi, {
        params: {
          romes: values.job.romes.join(","),
          longitude: values.location.value.coordinates[0],
          latitude: values.location.value.coordinates[1],
          radius: values.radius || 30,
          diploma: values.diploma,
        },
      });

      dispatch(setTrainings(response.data));

      setHasSearch(true);
      setIsFormVisible(false);

      if (response.data.length) setTrainingMarkers(factorTrainingsForMap(response.data), store, showResultList);
    } catch (err) {
      console.log(
        `Erreur interne lors de la recherche de formations (${err.response.status} : ${
          err.response.data ? err.response.data.error : ""
        })`
      );
      setTrainingSearchError(
        `Erreur interne lors de la recherche de formations (${err.response.status} : ${
          err.response.data ? err.response.data.error : ""
        })`
      );
    }

    setIsTrainingSearchLoading(false);
  };

  const searchForJobsWithStrictRadius = async (values) => {
    searchForJobs(values, "strict");
  };

  const searchForJobsWithLooseRadius = async () => {
    clearJobMarkers();

    dispatch(setExtendedSearch(true));
    scrollToTop("rightColumn");

    dispatch(setJobs([]));
    searchForJobs(formValues, null);
  };

  const searchForJobs = async (values, strictRadius) => {
    setIsJobSearchLoading(true);
    setJobSearchError("");

    try {
      const searchCenter = [values.location.value.coordinates[0], values.location.value.coordinates[1]];

      const response = await axios.get(jobsApi, {
        params: {
          romes: values.job.romes.join(","),
          longitude: values.location.value.coordinates[0],
          latitude: values.location.value.coordinates[1],
          insee: values.location.insee,
          zipcode: values.location.zipcode,
          radius: values.radius || 30,
          strictRadius: strictRadius ? "strict" : null,
        },
      });

      let peJobs = null;

      let results = {};

      if (response.data === "romes_missing") {
        setJobSearchError(`Erreur interne lors de la recherche d'emplois  (400 : romes manquants)`);
      } else {
        if (!response.data.peJobs.result || response.data.peJobs.result !== "error")
          peJobs = await computeMissingPositionAndDistance(
            searchCenter,
            response.data.peJobs.resultats,
            "pe",
            map,
            store,
            showResultList
          );

        results = {
          peJobs: response.data.peJobs.result && response.data.peJobs.result === "error" ? null : peJobs,
          lbbCompanies:
            response.data.lbbCompanies.result && response.data.lbbCompanies.result === "error"
              ? null
              : response.data.lbbCompanies,
          lbaCompanies:
            response.data.lbaCompanies.result && response.data.lbaCompanies.result === "error"
              ? null
              : response.data.lbaCompanies,
        };
      }

      dispatch(setJobs(results));

      setJobMarkers(results, map, store, showResultList);
    } catch (err) {
      console.log(
        `Erreur interne lors de la recherche d'emplois (${
          err.response && err.response.status ? err.response.status : ""
        } : ${err.response && err.response.data ? err.response.data.error : err.message})`
      );
      setJobSearchError(
        `Erreur interne lors de la recherche d'emplois (${
          err.response && err.response.status ? err.response.status : ""
        } : ${err.response && err.response.data ? err.response.data.error : err.message})`
      );
    }

    setIsJobSearchLoading(false);
  };

  const getResultLists = () => {
    return (
      <ResultLists
        hasSearch={hasSearch}
        isFormVisible={isFormVisible}
        selectedItem={selectedItem}
        handleSelectItem={handleSelectItem}
        showSearchForm={showSearchForm}
        isTrainingSearchLoading={isTrainingSearchLoading}
        isJobSearchLoading={isJobSearchLoading}
        searchRadius={searchRadius}
        trainings={trainings}
        isTrainingOnly={isTrainingOnly}
        handleExtendedSearch={searchForJobsWithLooseRadius}
        searchForJobsOnNewCenter={searchForJobsOnNewCenter}
        searchForTrainingsOnNewCenter={searchForTrainingsOnNewCenter}
        jobs={jobs}
      />
    );
  };

  const getSearchForm = () => {
    return (
      <SearchForm
        isFormVisible={isFormVisible}
        selectedItem={selectedItem}
        hasSearch={hasSearch}
        showResultList={showResultList}
        handleSubmit={handleSubmit}
      />
    );
  };

  const getSelectedItemDetail = () => {
    return <ItemDetail selectedItem={selectedItem} handleClose={handleClose} />;
  };

  return (
    <div id="rightColumn" className="rightCol">
      {getSearchForm()}
      {getResultLists()}
      {getSelectedItemDetail()}
    </div>
  );
};

export default RightColumn;
