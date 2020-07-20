import React, { useState } from "react";
import axios from "axios";
import { Button, Container, Row, Col, Input } from "reactstrap";
import "../searchfortrainingsandjobs.css";
import mapMarker from "../../../assets/icons/pin.svg";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AutoCompleteField, LogoIdea, RadioButton } from "../../../components";
import { fetchAddresses } from "../../../services/baseAdresse";
import baseUrl from "../../../utils/baseUrl";
import { ReactiveBase, DataSearch } from "@appbaseio/reactivesearch";
import config from "../../../config";

const romeLabelsApi = baseUrl + "/romelabels";

export const fetchRomes = async (value) => {
  if (value) {
    const response = await axios.get(romeLabelsApi, { params: { title: value } });

    if (response.data instanceof Array) return response.data;
    else return [];
  } else return [];
};

const SearchForm = (props) => {
  const [locationRadius, setLocationRadius] = useState(30);

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

  const handleRadiusChange = (radius, setFieldValue) => {
    setLocationRadius(radius);

    setTimeout(() => {
      setFieldValue("radius", radius);
    }, 0);
  };

  const handleDiplomaChange = (evt, setFieldValue) => {
    const value = evt.currentTarget.value;
    setTimeout(() => {
      setFieldValue("diploma", value);
    }, 0);
  };

  const getRadioButton = (value, label, selectedValue, setFieldValue) => {
    return (
      <Col xs="3" className="radioButton">
        <RadioButton
          handleChange={handleRadiusChange}
          value={value}
          label={label}
          selectedValue={selectedValue}
          setFieldValue={setFieldValue}
        />
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
            errors.job = "Sélectionnez un domaine proposé";
          }
          if (!values.location || !values.location.label) {
            errors.location = "Sélectionnez un lieu proposé";
          }
          return errors;
        }}
        initialValues={{ job: {}, location: {}, locationRadius: 30, diploma: "" }}
        onSubmit={props.handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
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
                  
                  <label htmlFor="jobField">Votre projet est dans le domaine ...</label>
                  

                  <br /><br /><br /><br /><br /><br />
                  <ReactiveBase
                      app="pivotromesmetiers"
                      url={`${config.aws.apiGateway.endpoint}/es/search`}
                    >
                          <DataSearch
                            title="Métier"
                            placeholder="Choisissez votre métier"
                            dataField={['domaine', 'motfs_clefs']}
                            fieldWeights={[1,1]}
                            componentId="SEARCH"
                            autosuggest={true}
                            showFilter={true}
                          />
                      
                  </ReactiveBase>
                  <br /><br /><br /><br /><br /><br />  
                  
                  <ErrorMessage name="job" className="errorField" component="div" />
                </div>
              </Col>

              <Col xs="12">
                <div className="formGroup">
                  <label htmlFor="diplomaField">Le diplôme que vous souhaitez obtenir ...</label>
                  <div className="fieldContainer">
                    <Input onChange={(evt) => handleDiplomaChange(evt, setFieldValue)} type="select" name="diploma">
                      <option value="">Indifférent</option>
                      <option value="3 (CAP...)">CAP</option>
                      <option value="4 (Bac...)">Bac</option>
                      <option value="5 (BTS, DUT...)">BTS, DUT</option>
                      <option value="6 (Licence...)">Licence</option>
                      <option value="7 (Master, titre ingénieur...)">Master, titre ingénieur</option>
                    </Input>
                  </div>
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
                        {getRadioButton(10, "10km", locationRadius, setFieldValue)}
                        {getRadioButton(30, "30km", locationRadius, setFieldValue)}
                        {getRadioButton(60, "60km", locationRadius, setFieldValue)}
                        {getRadioButton(100, "100km", locationRadius, setFieldValue)}
                      </Row>

                      <ErrorMessage name="locationRadius" className="errorField" component="div" />
                    </Container>
                  </div>
                </div>
              </Col>
            </Row>

            <Button className="submitButton" type="submit" disabled={isSubmitting}>
              Voir les résultats
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SearchForm;
