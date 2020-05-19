import React, { useState } from "react";
import axios from "axios";
import { Button, Container, Row, Col, FormGroup, Label, Input } from "reactstrap";
import "./apitester.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Formik, Form, ErrorMessage } from "formik";
import { AutoCompleteField } from "../../components";
import { fetchAddresses } from "../../services/baseAdresse";
//import Training from "./Training";
import ReactJson from "react-json-view";

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

const ApiTester = () => {
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

  const handleSubmit = async (values) => {
    searchForTrainings(values);
    searchForJobs(values);
  };

  const searchForTrainings = async (values) => {
    const response = await axios.get(formationsApi, { params: { romes: values.job.rome } });
    setTrainings(response.data);
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
    if (trainings) {
      return (
        <div className="apiResult">
          <h2>Formations ({trainings.length})</h2>
          <ReactJson src={trainings} />
        </div>
      );
    } else {
      return "";
    }
  };

  const getJobResult = () => {
    if (jobs) {
      return (
        <div className="apiResult">
          <h2>Postes ({jobs.peJobs.length}), Bonnes boîtes ({jobs.lbbCompanies.companies.length})</h2>
          <ReactJson src={jobs} />
        </div>
      );
    } else {
      return "";
    }
  };

  return (
    <div className="page apiTestPage">
      <Container>
        <Row>
          <Col xs="12">
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
                    <Col xs="12" md="6">
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
                    <Col xs="12" md="6">
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
          </Col>
        </Row>
        <Row>
          <Col xs="12" lg="6">
            {getTrainingResult()}
          </Col>
          <Col xs="12" lg="6">
            {getJobResult()}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ApiTester;
