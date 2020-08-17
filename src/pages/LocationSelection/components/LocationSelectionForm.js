import React, { useState } from "react";
import { Button, Container, Row, Col, FormGroup, Label, Input } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import "./locationSelectionForm.css";
import { push } from "connected-react-router";
import routes from "../../../routes.json";
import { setLocation } from "../../../redux/Filter/actions";
import { gtag } from "../../../services/googleAnalytics";
import { AutoCompleteField } from "../../../components";
import { fetchAddresses } from "../../../services/baseAdresse";

const LocationSelectionForm = (props) => {
  const dispatch = useDispatch();
  const { location, locationRadius } = useSelector((state) => state.filters);

  const [lR, setLR] = useState(locationRadius);

  const handleChange = (response) => {
    setLR(response);
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
  const updateValuesFromAutoComplete = (item, setFieldValue) => {
    //setTimeout perme d'éviter un conflit de setState
    setTimeout(() => {
      setFieldValue("location", item ? item.label : "");
      //setFieldValue("jobSelectorValue", item ? item.value : "");
    }, 0);
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
    <Formik
      initialValues={{ location, locationRadius: lR }}
      validate={(values) => {
        const errors = {};
        if (!values.location) {
          errors.location = "Choisis une réponse dans la liste";
        }
        if (!lR) {
          errors.locationRadius = "Choisis une réponse";
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        gtag("tunnelNextStep", "locationSelection", values.location);
        dispatch(setLocation(values.location, lR));
        dispatch(push(routes.TRAININGLIST));
      }}
    >
      {({ values, isSubmitting, setFieldValue }) => (
        <Form>
          <div className="formGroup">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            <AutoCompleteField
              items={[]}
              initialIsOpen={false}
              initialItem={{ label: location /*, value: job.value*/ }}
              itemToStringFunction={autoCompleteToStringFunction}
              onSelectedItemChangeFunction={updateValuesFromAutoComplete}
              compareItemFunction={compareAutoCompleteValues}
              onInputValueChangeFunction={fetchAddresses}
              name="location"
              placeholder="cherche une ville"
            />
          </div>
          <ErrorMessage name="location" className="errorField" component="div" />

          <Container>
            <Row>
              <Col xs="12">
                <p>le rayon maximum accepté est de </p>
                <Field type="hidden" value={lR} name="locationRadius" />
              </Col>
            </Row>
            <Row>
              <div className="buttons">
                <Container>
                  <Row>
                    {getRadioButton(10, "10km", lR)}
                    {getRadioButton(30, "30km", lR)}
                    {getRadioButton(60, "60km", lR)}
                    {getRadioButton(100, "100km", lR)}
                  </Row>

                  <ErrorMessage name="locationRadius" className="errorField" component="div" />
                </Container>
              </div>
            </Row>
          </Container>

          <Button type="submit" disabled={isSubmitting}>
            Valider
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default LocationSelectionForm;
