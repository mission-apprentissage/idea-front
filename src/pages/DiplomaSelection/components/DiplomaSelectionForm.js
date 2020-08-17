import React from "react";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPassport } from "@fortawesome/free-solid-svg-icons";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import "./diplomaSelectionForm.css";
import { push } from "connected-react-router";
import routes from "../../../routes.json";
import { setDiploma } from "../../../redux/Filter/actions";
import { gtag } from "../../../services/googleAnalytics";

const DiplomaSelectionForm = (props) => {
  const dispatch = useDispatch();
  const { diploma } = useSelector((state) => state.filters);

  return (
    <Formik
      initialValues={{ diploma }}
      validate={(values) => {
        const errors = {};
        if (!values.diploma) {
          errors.diploma = "Choisis un diplôme";
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        dispatch(setDiploma(values.diploma));

        gtag("tunnelNextStep", "diplomaSelection", values.diploma );
        dispatch(push(routes.STARTTIMESELECTION));
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="formGroup">
            <FontAwesomeIcon icon={faPassport} />
            <Field name="diploma" required as="select">
              <option disabled value="">
                Indique ton diplôme
              </option>
              <option value="CAP">CAP</option>
              <option value="Bac pro">Bac pro</option>
              <option value="BTS">BTS</option>
              <option value="DUT">DUT</option>
              <option value="Licence pro">Licence pro</option>
              <option value="Master">Master</option>
              <option value="Diplôme d'Ingénieur">Diplôme d'Ingénieur</option>
              <option value="Mention complémentaire">Mention complémentaire</option>
            </Field>
          </div>
          <ErrorMessage name="diploma" className="errorField" component="div" />

          <Button type="submit" disabled={isSubmitting}>
            Valider
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default DiplomaSelectionForm;
