import React, { useState } from "react";
import axios from "axios";
import { IdeaHeader } from "../../components";
import { Button, Container, Row, Col, FormGroup, Label, Input } from "reactstrap";
import "./apitester.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Formik, Form, ErrorMessage } from "formik";
import { AutoCompleteField } from "../../components";
import Training from "./Training";

const baseUrl =
  window.location.hostname === "localhost" ? "http://localhost:3000" : "https://idea-mna-api.herokuapp.com";

const formationApi = baseUrl + "/formation";
const romesApi = baseUrl + "/romes";
const romeLabelsApi = baseUrl + "/romelabels";

const ApiTester = () => {
  const jobItems = [
    { label: "Maçon", value: "F1703" },
    { label: "Boucher", value: "D1101" },
    //{ label: "Opticien", value: "C0000" },
  ];

  // indique l'attribut de l'objet contenant le texte de l'item sélectionné à afficher
  const autoCompleteToStringFunction = (item) => {
    return item ? item.label : "";
  };

  // Permet de sélectionner un élément dans la liste d'items correspondant à un texte entré au clavier
  const compareAutoCompleteValues = (items, value) => {
    return items.findIndex((element) => element.label.toLowerCase() === value.toLowerCase());
  };

  // Mets à jours les valeurs de champs du formulaire Formik à partir de l'item sélectionné dans l'AutoCompleteField
  const updateValuesFromAutoComplete = (item, setFieldValue) => {
    //setTimeout perme d'éviter un conflit de setState
    setTimeout(() => {
      setFieldValue("job", item);
    }, 0);
  };

  const [trainings, setTrainings] = useState(null);

  const handleSearchTrainingSubmit = async (values, { setSubmitting }) => {
    const response = await axios.get(formationApi, { params: { romes: values.job.value } });

    console.log(response);
    setTrainings(response.data);
  };

  const getResult = () => {
    if (trainings) {
      return (
        <div>
          {trainings.map((training, idx) => {
            return <Training key={idx} training={training} />;
          })}
        </div>
      );
    } else {
      return "";
    }
  };

  return (
    <div className="page trainingDuration">
      <IdeaHeader />
      <Container>
        <Row>
          <Col xs="12">
            <h2>Test des APIs IDEA</h2>
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="6" md="3">
            <Container>
              <Row>
                <div>RECHERCHE DE FORMATIONS</div>
                <Formik
                  validate={(values) => {
                    const errors = {};
                    if (!values.job || !values.job.label || !values.job.value) {
                      errors.job = "Sélectionne un métier";
                    }
                    return errors;
                  }}
                  initialValues={{ job: {} }}
                  onSubmit={handleSearchTrainingSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="formGroup">
                        <FontAwesomeIcon icon={faSearch} />
                        <AutoCompleteField
                          items={jobItems}
                          initialIsOpen={true}
                          itemToStringFunction={autoCompleteToStringFunction}
                          onSelectedItemChangeFunction={updateValuesFromAutoComplete}
                          compareItemFunction={compareAutoCompleteValues}
                          name="jobField"
                          placeholder="ex: boucher"
                        />
                      </div>
                      <ErrorMessage name="job" className="errorField" component="div" />

                      <Button type="submit" disabled={isSubmitting}>
                        Valider
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Row>
            </Container>
          </Col>
          <Col xs="12" sm="6" md="9">
            {getResult()}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ApiTester;
