import React, { useState } from "react";
import axios from "axios";
import { Button, Row, Col, FormGroup } from "reactstrap";
import "./searchdemo.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Formik, Form, ErrorMessage } from "formik";
import { AutoCompleteField } from "../../components";
import { fetchAddresses } from "../../services/baseAdresse";
import ReactMapboxGl, { Layer, Feature, ZoomControl } from "react-mapbox-gl";
import Training from "./Training";
import PeJob from "./PeJob";
import LbbCompany from "./LbbCompany";

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiYWxhbmxyIiwiYSI6ImNrYWlwYWYyZDAyejQzMHBpYzE0d2hoZWwifQ.FnAOzwsIKsYFRnTUwneUSA",
});

const baseUrl =
  window.location.hostname === "localhost" ? "http://localhost:3000" : "https://idea-mna-api.herokuapp.com";

const formationsApi = baseUrl + "/formations";
const jobsApi = baseUrl + "/jobs";
const romeLabelsApi = baseUrl + "/romelabels";

export const fetchRomes = async (value) => {
  if (value) {
    const response = await axios.get(romeLabelsApi, { params: { title: value } });

    if (response.data instanceof Array) return response.data;
    else return [];
  } else return [];
};

const SearchDemo = () => {
  // indique l'attribut de l'objet contenant le texte de l'item sélectionné à afficher
  const autoCompleteToStringFunction = (item) => {
    return item ? item.label : "";
  };

  // Permet de sélectionner un élément dans la liste d'items correspondant à un texte entré au clavier
  const compareAutoCompleteValues = (items, value) => {
    return items.findIndex((element) => element.label.toLowerCase() === value.toLowerCase());
  };

  // Mets à jours les valeurs de champs du formulaire Formik à partir de l'item sélectionné dans l'AutoCompleteField
  const updateValuesFromJobAutoComplete = (item, setFieldValue) => {
    //setTimeout perme d'éviter un conflit de setState
    setTimeout(() => {
      setFieldValue("job", item);
    }, 0);
  };

  // Mets à jours les valeurs de champs du formulaire Formik à partir de l'item sélectionné dans l'AutoCompleteField
  const updateValuesFromPlaceAutoComplete = (item, setFieldValue) => {
    //setTimeout perme d'éviter un conflit de setState
    setTimeout(() => {
      setFieldValue("location", item);
    }, 0);
  };

  const [trainings, setTrainings] = useState(null);
  const [jobs, setJobs] = useState(null);
  const [hasSearch, setHasSearch] = useState(false);

  const [mapState, setMapState] = useState({
    lon: 2.3488,
    lat: 48.85341,
    zoom: 2,
  });

  const getMap = () => {
    return (
      <Map
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
          height: "100vh",
          width: "100%",
        }}
        maxPitch={0}
        disab={false}
        center={[mapState.lon, mapState.lat]}
      >
        <ZoomControl position="bottom-left" />
        <Layer type="symbol" id="marker" layout={{ "icon-image": "marker-15" }}>
          <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
        </Layer>
      </Map>
    );
  };

  const handleSubmit = async (values) => {
    setMapState({ lon: values.location.value.coordinates[0], lat: values.location.value.coordinates[1] });

    searchForTrainings(values);
    searchForJobs(values);
  };

  const searchForTrainings = async (values) => {
    const response = await axios.get(formationsApi, {
      params: {
        romes: values.job.rome,
        longitude: values.location.value.coordinates[0],
        latitude: values.location.value.coordinates[1],
      },
    });
    setTrainings(response.data);
    setHasSearch(true);
  };

  const searchForJobs = async (values) => {
    const response = await axios.get(jobsApi, {
      params: {
        romes: values.job.rome,
        longitude: values.location.value.coordinates[0],
        latitude: values.location.value.coordinates[1],
        insee: values.location.insee,
        zipcode: values.location.zipcode,
      },
    });

    let results = { peJobs: response.data.peJobs.resultats, lbbCompanies: response.data.lbbCompanies };

    setJobs(results);
  };

  const getTrainingResult = () => {
    if (hasSearch) {
      return (
        <div className="trainingResult">
          <h2>Formations ({trainings.length})</h2>
          {getTrainingList()}
        </div>
      );
    } else {
      return "";
    }
  };

  const getTrainingList = () => {
    if (trainings.length) {
      return (
        <>
          {trainings.map((training, idx) => {
            return <Training key={idx} training={training} />;
          })}
        </>
      );
    } else return <div className="listText">Aucune formation pour ces critères de recherche</div>;
  };

  const getJobResult = () => {
    if (jobs) {
      return (
        <div className="jobResult">
          <h2>
            Postes ({jobs.peJobs ? jobs.peJobs.length : 0}), Bonnes boîtes ({jobs.lbbCompanies.companies.length})
          </h2>

          {getPeJobList()}
          {getLbbCompanyList()}
        </div>
      );
    } else {
      return "";
    }
  };

  const getPeJobList = () => {
    if (jobs && jobs.peJobs && jobs.peJobs.length) {
      return (
        <>
          <div className="listText">Postes ouverts en alternance sur Pôle emploi</div>
          {jobs.peJobs.map((job, idx) => {
            return <PeJob key={idx} job={job} />;
          })}
        </>
      );
    } else return <div className="listText">Aucun poste pour ces critères de recherche</div>;
  };

  const getLbbCompanyList = () => {
    if (jobs && jobs.lbbCompanies && jobs.lbbCompanies.companies_count) {
      return (
        <>
          <div className="listText">Sociétés recrutant en alternance</div>
          {jobs.lbbCompanies.companies.map((company, idx) => {
            return <LbbCompany key={idx} company={company} />;
          })}
        </>
      );
    } else
      return (
        <div className="listText">
          Aucune société susceptible de recruter en alternance pour ces critères de recherche
        </div>
      );
  };

  const getSearchForm = () => {
    return (
      <>
        <h1>Test des APIs IDEA</h1>
        <Formik
          validate={(values) => {
            const errors = {};
            if (!values.job || !values.job.label || !values.job.rome) {
              errors.job = "Sélectionne un métier";
            }
            return errors;
          }}
          initialValues={{ job: {} }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Row>
                <Col xs="12">
                  <div className="formGroup">
                    <FontAwesomeIcon icon={faSearch} />
                    <AutoCompleteField
                      items={[]}
                      itemToStringFunction={autoCompleteToStringFunction}
                      onSelectedItemChangeFunction={updateValuesFromJobAutoComplete}
                      compareItemFunction={compareAutoCompleteValues}
                      onInputValueChangeFunction={fetchRomes}
                      name="jobField"
                      placeholder="ex: boucher"
                    />
                  </div>
                  <ErrorMessage name="job" className="errorField" component="div" />
                </Col>
                <Col xs="12">
                  <div className="formGroup">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <AutoCompleteField
                      items={[]}
                      itemToStringFunction={autoCompleteToStringFunction}
                      onSelectedItemChangeFunction={updateValuesFromPlaceAutoComplete}
                      compareItemFunction={compareAutoCompleteValues}
                      onInputValueChangeFunction={fetchAddresses}
                      name="placeField"
                      placeholder="ex: Nantes"
                    />
                  </div>
                  <ErrorMessage name="location" className="errorField" component="div" />
                </Col>
              </Row>

              <Button type="submit" disabled={isSubmitting}>
                Valider
              </Button>
            </Form>
          )}
        </Formik>
      </>
    );
  };

  return (
    <div className="page demoPage">
      <Row>
        <Col xs="12" lg="3">
          <div className="leftCol">
            {getSearchForm()}
            {getTrainingResult()}
            {getJobResult()}
          </div>
        </Col>
        <Col xs="12" lg="9">
          {getMap()}
        </Col>
      </Row>
    </div>
  );
};

export default SearchDemo;
