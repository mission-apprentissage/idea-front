import React from "react";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { Formik, Form, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import "./startTimeSelectionForm.css";
import { push } from "connected-react-router";
import routes from "../../../routes.json";
import { setTrainingStartTime } from "../../../redux/Filter/actions";
import { DatePickerField } from "../../../components";

const StartTimeSelectionForm = (props) => {
  const dispatch = useDispatch();
  const { startTime } = useSelector((state) => state.filters);

  return (
    <Formik
      initialValues={{ startTime }}
      validate={(values) => {
        const errors = {};
        if (!values.startTime) {
          errors.startTime = "Requis";
        }
        return errors;
      }}
      onSubmit={(values) => {
        dispatch(setTrainingStartTime(values.startTime));
        dispatch(push(routes.LOCATIONSELECTION));
      }}
    >
      {({ values, isSubmitting, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <div className="formGroup">
            <FontAwesomeIcon icon={faCalendar} />

            <DatePickerField name="startTime" todayButton="Aujourd'hui" placeholderText="Sélectionnez une date" />
          </div>
          <ErrorMessage name="startTime" className="errorField" component="div" />
          <Button type="submit" className="cta" disabled={isSubmitting}>
            Valider
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default StartTimeSelectionForm;