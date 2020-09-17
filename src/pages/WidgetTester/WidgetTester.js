import React, { useState } from "react";
import { Button, Container, Row, Col, FormGroup, Label, Input } from "reactstrap";
import "./widgettester.css";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { AutoCompleteField, RadioButton } from "../../components";
import { fetchAddresses } from "../../services/baseAdresse";
import baseUrl from "../../utils/baseUrl";
import mapMarker from "../../assets/icons/pin.svg";
import { fetchRomes } from "../SearchForTrainingsAndJobs/components/SearchForm";

const romeLabelsApi = baseUrl + "/romelabels";


const WidgetTester = () => {
  const [locationRadius, setLocationRadius] = useState(0);

  const getRadioButton = (value, label, selectedValue, setFieldValue) => {
    return (
      <Col xs="2" className="radioButton">
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

  const handleRadiusChange = (radius, setFieldValue) => {
    setLocationRadius(radius);

    setTimeout(() => {
      setFieldValue("radius", radius);
    }, 0);
  };

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

  const handleSubmit = async (values) => {

    console.log("values : ",values);


  };

  const getWidget = (params) => {
    let ideaUrl = window.location.origin;

    return (
      <iframe
        title={params.title}
        style={{
          marginTop: "30px",
          marginBottom: "30px",
          height: `${params.height}px`,
          width: params.width ? `${params.width}px` : "100%",
        }}
        src={ideaUrl}
      />
    );
  };

  const getForm = () => {
    return (
      <Formik initialValues={{ job: {}, location: {}, radius: 0 }} onSubmit={handleSubmit}>
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <Row>
              <Col xs="12">
                <div className="formGroup">
                  <label htmlFor="jobField">Métier</label>
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
                  <label htmlFor="placeField">Centre de recherche</label>
                  <div className="fieldContainer">
                    <AutoCompleteField
                      items={[]}
                      itemToStringFunction={autoCompleteToStringFunction}
                      onSelectedItemChangeFunction={updateValuesFromPlaceAutoComplete}
                      compareItemFunction={compareAutoCompleteValues}
                      onInputValueChangeFunction={fetchAddresses}
                      scrollParentId="rightColumn"
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
                  <label>Rayon de recherche</label>
                  <Field type="hidden" value={locationRadius} name="locationRadius" />
                  <div className="buttons">
                    <Container>
                      <Row>
                        {getRadioButton(0, "Non défini", locationRadius, setFieldValue)}
                        {getRadioButton(10, "10km", locationRadius, setFieldValue)}
                        {getRadioButton(30, "30km", locationRadius, setFieldValue)}
                        {getRadioButton(60, "60km", locationRadius, setFieldValue)}
                        {getRadioButton(100, "100km", locationRadius, setFieldValue)}
                      </Row>
                    </Container>
                  </div>
                </div>
              </Col>
            </Row>

            <Button className="submitButton" type="submit" disabled={isSubmitting}>
              Mettre à jour les widgets
            </Button>
          </Form>
        )}
      </Formik>
    );
  };

  return (
    <div className="page demoPage widgetTestPage">
      <Container>
        <Row>
          <Col xs="12">
            <h1>Test du Widget Idea</h1>
            {getForm()}
          </Col>
        </Row>
        <Row className="widgetList">
          <Col xs="12">
            <h3>Largeur 317 px - hauteur 640 px</h3>
            {getWidget({
              title: "narrow",
              height: 640,
              width: 317,
            })}
          </Col>
          <Col xs="12">
            <h3>Largeur 360 px - hauteur 640 px</h3>
            {getWidget({
              title: "mobile",
              height: 640,
              width: 360,
            })}
          </Col>
          <Col xs="12">
            <h3>Largeur 768 px - hauteur 800 px</h3>
            {getWidget({
              title: "tablet",
              height: 800,
              width: 768,
            })}
          </Col>
          <Col xs="12">
            <h3>Largeur 100% - hauteur 800 px</h3>
            {getWidget({
              title: "desktop",
              height: 800,
            })}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default WidgetTester;
