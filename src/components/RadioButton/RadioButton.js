import React from "react";
import { FormGroup, Label, Input } from "reactstrap";

const RadioButton = React.memo(({ handleChange, value, label, selectedValue, setFieldValue }) => {
  return (
    <FormGroup check>
      <Label
        check
        className={`btn ${selectedValue === value ? "active" : ""}`}
        onClick={() => {
          handleChange(value, setFieldValue);
        }}
      >
        <Input
          type="radio"
          name="locationRadius"
          onChange={() => handleChange(value, setFieldValue)}
          checked={selectedValue === value}
        />{" "}
        {label}
      </Label>
    </FormGroup>
  );
});

export default RadioButton;
