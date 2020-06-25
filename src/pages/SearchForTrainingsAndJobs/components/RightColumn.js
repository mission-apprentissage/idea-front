import React, { useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";
import ItemDetail from "../../../components/ItemDetail/ItemDetail";
import { setJobMarkers, setTrainingMarkers } from "../utils/mapTools";
import SearchForm from "./SearchForm";
import ResultLists from "./ResultLists";
import { setTrainings, setJobs, setSelectedItem } from "../../../redux/Training/actions";
import {
  map,
  flyToMarker,
  closeMapPopups,
  clearMarkers,
  factorTrainingsForMap,
  computeDistanceFromSearch,
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
}) => {
  const dispatch = useDispatch();

  const store = useStore();

  const { trainings, jobs, selectedItem } = useSelector((state) => state.trainings);

  const [isTrainingSearchLoading, setIsTrainingSearchLoading] = useState(true);
  const [isJobSearchLoading, setIsJobSearchLoading] = useState(true);
  const [searchRadius, setSearchRadius] = useState(30);

  let searchCenter;

  const handleSubmit = async (values) => {
    clearMarkers();
    // centrage de la carte sur le lieu de recherche
    searchCenter = [values.location.value.coordinates[0], values.location.value.coordinates[1]];

    setSearchRadius(values.radius || 30);

    map.flyTo({ center: searchCenter, zoom: 10 });

    setIsTrainingSearchLoading(true);
    setIsJobSearchLoading(true);

    try {
      searchForTrainings(values);
      searchForJobs(values);
      setIsFormVisible(false);
    } catch (err) {
      console.log("error loading data ", err); //TODO: faire un vrai traitement d'erreur
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
    const response = await axios.get(formationsApi, {
      params: {
        romes: values.job.rome,
        longitude: values.location.value.coordinates[0],
        latitude: values.location.value.coordinates[1],
        radius: values.radius || 30,
        diploma: values.diploma,
      },
    });

    dispatch(setTrainings(response.data));

    setHasSearch(true);
    setIsFormVisible(false);
    setIsTrainingSearchLoading(false);

    if (response.data.length) setTrainingMarkers(factorTrainingsForMap(response.data), store, showResultList);
  };

  const searchForJobs = async (values) => {
    const response = await axios.get(jobsApi, {
      params: {
        romes: values.job.rome,
        longitude: values.location.value.coordinates[0],
        latitude: values.location.value.coordinates[1],
        insee: values.location.insee,
        zipcode: values.location.zipcode,
        radius: values.radius || 30,
      },
    });

    let results = {
      peJobs:
        response.data.peJobs.result && response.data.peJobs.result === "error"
          ? null
          : computeDistanceFromSearch(searchCenter, response.data.peJobs.resultats, "pe"),
      lbbCompanies:
        response.data.lbbCompanies.result && response.data.lbbCompanies.result === "error"
          ? null
          : response.data.lbbCompanies,
    };

    dispatch(setJobs(results));

    setIsJobSearchLoading(false);

    setJobMarkers(results, map, store, showResultList);
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
    <div className="rightCol">
      {getSearchForm()}
      {getResultLists()}
      {getSelectedItemDetail()}
    </div>
  );
};

export default RightColumn;
