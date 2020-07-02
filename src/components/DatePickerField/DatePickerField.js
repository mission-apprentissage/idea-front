import React from "react";
import { useField, useFormikContext } from "formik";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fr from "date-fns/locale/fr";

registerLocale("fr", fr);

export const DatePickerField = ({ ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  return (
    <DatePicker
      {...field}
      {...props}
      locale="fr"
      selected={(field.value && new Date(field.value)) || null}
      dateFormat={props.dateFormat?props.dateFormat:"dd MMMM yyyy"}
      showMonthYearPicker={props.showMonthYearPicker?true:false}
      onChange={(val) => {
        setFieldValue(field.name, val);
      }}
    />
  );
};

export default DatePickerField;
