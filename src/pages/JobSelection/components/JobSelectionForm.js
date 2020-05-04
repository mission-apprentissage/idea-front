import React from "react";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import "./jobSelectionForm.css";
import { push } from "connected-react-router";
import routes from "../../../routes.json";
import { setJob } from "../../../redux/Filter/actions";
import { logEvent } from "../../../services/amplitude";
import { AutoCompleteField } from "../../../components";

const JobSelectionForm = (props) => {
  const dispatch = useDispatch();
  const { job } = useSelector((state) => state.filters);
  const jobItems = [
    { label: "Maçon", value: "A0000" },
    { label: "Boucher", value: "B0000" },
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
      setFieldValue("jobSelectorLabel", item ? item.label : "");
      setFieldValue("jobSelectorValue", item ? item.value : "");
    }, 0);
  };

  return (
    <Formik
      initialValues={{ jobSelectorLabel: job.label, jobSelectorValue: job.value }}
      validate={(values) => {
        const errors = {};

        if (!values.jobSelectorLabel || !values.jobSelectorValue) {
          errors.jobSelectorLabel = "Choisis une réponse dans la liste";
        }

        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values);
        logEvent("tunnelNextStep", { currentStep: "jobSelection", job: values.jobSelectorLabel });
        dispatch(setJob(values.jobSelectorLabel, values.jobSelectorValue));
        dispatch(push(routes.HASDIPLOMASELECTION));
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          {/*<div className="formGroup">
            
            <Field type="text" placeholder="ex: boucher" name="jobSelectorLabel" />
            </div>*/}
          <div className="formGroup">
            <FontAwesomeIcon icon={faSearch} />
            <AutoCompleteField
              items={jobItems}
              initialIsOpen={true}
              initialItem={{ label: job.label, value: job.value }}
              itemToStringFunction={autoCompleteToStringFunction}
              onSelectedItemChangeFunction={updateValuesFromAutoComplete}
              compareItemFunction={compareAutoCompleteValues}
              name="jobField"
              placeholder="ex: boucher"
            />
          </div>
          <ErrorMessage name="jobSelectorLabel" className="errorField" component="div" />

          <Button type="submit" disabled={isSubmitting}>
            Valider
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default JobSelectionForm;
