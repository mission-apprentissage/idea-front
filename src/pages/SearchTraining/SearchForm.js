import React, { useState } from "react";
import axios from "axios";
import { Button, Container, Row, Col, FormGroup, Label, Input } from "reactstrap";
import "./searchtraining.css";
import mapMarker from "../../assets/icons/pin.svg";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AutoCompleteField, LogoIdea } from "../../components";
import { fetchAddresses } from "../../services/baseAdresse";
import baseUrl from "../../utils/baseUrl";

const romeLabelsApi = baseUrl + "/romelabels";

export const fetchRomes = async (value) => {
  if (value) {
    const response = await axios.get(romeLabelsApi, { params: { title: value } });

    if (response.data instanceof Array) return response.data;
    else return [];
  } else return [];
};

const SearchForm = (props) => {

  const [locationRadius, setLocationRadius] = useState(10);

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

  const handleChange = (response) => {
    setLocationRadius(response);
  };

  const getRadioButton = (value, label, selectedValue) => {
    return (
      <Col xs="3" className="radioButton">
        <FormGroup check>
          <Label
            check
            className={`btn ${selectedValue === value ? "active" : ""}`}
            onClick={() => {
              handleChange(value);
            }}
          >
            <Input
              type="radio"
              name="locationRadius"
              onChange={() => handleChange(value)}
              checked={selectedValue === value}
            />{" "}
            {label}
          </Label>
        </FormGroup>
      </Col>
    );
  };

  return (
    <div className={props.isFormVisible ? "" : "hiddenSearchForm"}>
      <header>
        <LogoIdea />
        {props.hasSearch ? (
          <Button className="blueButton" onClick={props.showResultList}>
            Retour
          </Button>
        ) : (
          ""
        )}
      </header>
      <div className="clearBoth" />

      <Formik
        validate={(values) => {
          const errors = {};
          if (!values.job || !values.job.label || !values.job.rome) {
            errors.job = "Sélectionne un métier";
          }
          return errors;
        }}
        initialValues={{ job: {} }}
        onSubmit={props.handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Row>
              <Col xs="12">
                <div className="formGroup">
                  <label htmlFor="jobField">Votre projet est dans le domaine ...</label>
                  <div className="fieldContainer">
                    <AutoCompleteField
                      items={[]}
                      itemToStringFunction={autoCompleteToStringFunction}
                      onSelectedItemChangeFunction={updateValuesFromJobAutoComplete}
                      compareItemFunction={compareAutoCompleteValues}
                      onInputValueChangeFunction={fetchRomes}
                      name="jobField"
                      placeholder="ex: plomberie"
                    />
                  </div>
                  <ErrorMessage name="job" className="errorField" component="div" />
                </div>
              </Col>
              <Col xs="12">
                <div className="formGroup">
                  <label htmlFor="placeField">A proximité de ...</label>
                  <div className="fieldContainer">
                    <AutoCompleteField
                      items={[]}
                      itemToStringFunction={autoCompleteToStringFunction}
                      onSelectedItemChangeFunction={updateValuesFromPlaceAutoComplete}
                      compareItemFunction={compareAutoCompleteValues}
                      onInputValueChangeFunction={fetchAddresses}
                      name="placeField"
                      placeholder="Adresse"
                    />
                    <img className="inFormIcon" src={mapMarker} alt="" />
                  </div>
                  <ErrorMessage name="location" className="errorField" component="div" />
                </div>
              </Col>

              <Col xs="12">
                <div className="formGroup">
                  <label>Dans un rayon de ...</label>
                  <Field type="hidden" value={locationRadius} name="locationRadius" />
                  <div className="buttons">
                    <Container>
                      <Row>
                        {getRadioButton(10, "10km", locationRadius)}
                        {getRadioButton(30, "30km", locationRadius)}
                        {getRadioButton(60, "60km", locationRadius)}
                        {getRadioButton(100, "100km", locationRadius)}
                      </Row>

                      <ErrorMessage name="locationRadius" className="errorField" component="div" />
                    </Container>
                  </div>
                </div>
              </Col>
            </Row>

            <Button className="submitButton" type="submit" disabled={isSubmitting}>
              Voir les formations
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SearchForm;
