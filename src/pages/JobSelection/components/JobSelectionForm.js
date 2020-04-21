import React from "react";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import "./jobSelectionForm.css";
//import Autocomplete from "react-autocomplete";
import { push } from "connected-react-router";
import routes from "../../../routes.json";
import { setJob } from "../../../redux/Filter/actions";

const JobSelectionForm = (props) => {
  const dispatch = useDispatch();
  const { job } = useSelector((state) => state.filters);

  return (
    <Formik
      initialValues={{ jobSelectorLabel: job.label, jobSelectorValue: "" }}
      validate={(values) => {
        const errors = {};
        if (!values.jobSelectorLabel) {
          errors.jobSelectorLabel = "Requis";
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        dispatch(setJob(values.jobSelectorLabel, ""));
        dispatch(push(routes.DIPLOMASELECTION));
      }}
    >
      {({ values, isSubmitting, setFieldValue }) => (
        <Form>
          <div className="formGroup">
            <FontAwesomeIcon icon={faSearch} />
            <Field type="text" placeholder="cherche un métier ..." name="jobSelectorLabel" />
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

/*
<Autocomplete
              getItemValue={item => item.label}
              items={[
                { label: "apple", value:"5" },
                { label: "banana", value:"8" },
                { label: "pear", value:"10" }
              ]}
              renderItem={(item, isHighlighted) => (
                <div
                  style={{ background: isHighlighted ? "lightgray" : "white" }}
                >
                  {item.label}
                </div>
              )}
              value={values.value}
              onChange={e => setFieldValue("jobSelectorValue", e.target.value)}
              onSelect={val => setFieldValue("jobSelectorValue", val)}
            />
*/
