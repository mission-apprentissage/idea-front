import React from "react";
import axios from "axios";
import { Button, Row, Col } from "reactstrap";
import "./searchdemo.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Formik, Form, ErrorMessage } from "formik";
import { AutoCompleteField } from "../../components";
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

  return (
    <div className={props.visibleForm ? "" : "hiddenSearchForm"}>
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
        onSubmit={props.handleSubmit}
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
    </div>
  );
};

export default SearchForm;
