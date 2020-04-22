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

const LocationSelectionForm = (props) => {
  const dispatch = useDispatch();
  const { location, locationRadius } = useSelector((state) => state.filters);

  const [lR, setLR] = useState(locationRadius);

  const handleChange = (response) => {
    setLR(response);
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
          errors.location = "Requis";
        }
        if (!lR) {
          errors.locationRadius = "Requis";
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        dispatch(setLocation(values.location, lR));
        dispatch(push(routes.TRAININGLIST));
      }}
    >
      {({ values, isSubmitting, setFieldValue }) => (
        <Form>
          <div className="formGroup">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            <Field type="text" placeholder="cherche une ville" name="location" />
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
