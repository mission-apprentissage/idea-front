import React, { useState, useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";
import ItemDetail from "../../../components/ItemDetail/ItemDetail";
import { setJobMarkers, setTrainingMarkers } from "../utils/mapTools";
import SearchForm from "./SearchForm";
import ResultLists from "./ResultLists";
import { setTrainings, setJobs, setSelectedItem, setItemToScrollTo } from "../../../redux/Training/actions";
import {
  map,
  flyToMarker,
  closeMapPopups,
  clearMarkers,
  factorTrainingsForMap,
  computeMissingPositionAndDistance,
} from "../../../utils/mapTools";

const formationsApi = baseUrl + "/formations";
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

  const { trainings, jobs, selectedItem, itemToScrollTo } = useSelector((state) => state.trainings);
  const [isTrainingSearchLoading, setIsTrainingSearchLoading] = useState(true);
  const [isJobSearchLoading, setIsJobSearchLoading] = useState(true);
  const [searchRadius, setSearchRadius] = useState(30);
  const [jobSearchError, setJobSearchError] = useState("");
  const [formationSearchError, setFormationSearchError] = useState("");

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
    if (item.type === "lbb" || item.type === "lba") id = `${item.type}${item.item.siret}`;
    else if (item.type === "training") id = `id${item.item.id}`;
    else if (item.type === "peJob") id = `id${item.item.id}`;

    let res = document.getElementById(id);

    return res;
  };

  let searchCenter;

  const handleSubmit = async (values) => {
    clearMarkers();
    // centrage de la carte sur le lieu de recherche
    searchCenter = [values.location.value.coordinates[0], values.location.value.coordinates[1]];

    setSearchRadius(values.radius || 30);

    map.flyTo({ center: searchCenter, zoom: 10 });

    setIsTrainingSearchLoading(true);
    setIsJobSearchLoading(true);
    setJobSearchError("");
    setFormationSearchError("");

    try {
      searchForTrainings(values);
      if (!isTrainingOnly) searchForJobs(values);
      setIsFormVisible(false);
    } catch (err) {
      setIsTrainingSearchLoading(false);
      setIsJobSearchLoading(false);
    }
  };

  const handleSelectItem = (item, type) => {
    flyToMarker(item, 12);
    closeMapPopups();
    dispatch(setSelectedItem({ item, type }));
  };

  const handleClose = () => {
    unSelectItem();
  };

  const searchForTrainings = async (values) => {
    try {
      const response = await axios.get(formationsApi, {
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
      setFormationSearchError(
        `Erreur interne lors de la recherche de formations (${err.response.status} : ${
          err.response.data ? err.response.data.error : ""
        })`
      );
    }

    setIsTrainingSearchLoading(false);
  };

  const searchForJobs = async (values) => {
    try {
      const response = await axios.get(jobsApi, {
        params: {
          romes: values.job.romes.join(","),
          longitude: values.location.value.coordinates[0],
          latitude: values.location.value.coordinates[1],
          insee: values.location.insee,
          zipcode: values.location.zipcode,
          radius: values.radius || 30,
        },
      });

      let peJobs = null;

      let results = {};

      if (response.data === "romes_missing") {
        console.log("faire un traitement d'erreur");
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
        `Erreur interne lors de la recherche d'emplois ' (${
          err.response && err.response.status ? err.response.status : ""
        } : ${err.response && err.response.data ? err.response.data.error : err.message})`
      );
      setJobSearchError(
        `Erreur interne lors de la recherche d'emplois  (${
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
