import React, { useState } from "react";
import { useField, useFormikContext } from "formik";
import { useCombobox } from "downshift";
import axios from "axios";

/*const items = [ {value:"a",label:"Bleu"},
{value:"b",label:"rouge"},
{value:"c",label:"Vert"} ];*/

//const items = [];

export const AutoCompleteField = ({ itemToStringFunction, onInputValueChangeFunction, items, ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);

  const [inputItems, setInputItems] = useState(items);

  const itemToString = (item) => {
    return item ? item.label : "";
  };

  const fetchAddresses = (value) => {
    const addressURL = `https://api-adresse.data.gouv.fr/search/?limit=15&q=${value}`;
    console.log(addressURL);
    axios.get(addressURL).then((response) => {
      //this.setState({ movies: response.data.results })
      console.log(response.data.features);
      const returnedItems = response.data.features.map((feature) => {
        console.log(feature);
        return { value: feature.geometry, label: feature.properties.label };
      });

      console.log("returned items : ", returnedItems);
      setInputItems(returnedItems);
    });
  };

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: inputItems,
    itemToString,
    onInputValueChange: ({ inputValue }) => {
      fetchAddresses(inputValue);

      /*setInputItems(
        items.filter(item =>
          item.label.toLowerCase().startsWith(inputValue.toLowerCase()),
        ),
      )*/
    },
  });
  return (
    <div>
      <label {...getLabelProps()}>Choose an element:</label>
      <div {...getComboboxProps()}>
        <input {...getInputProps()} />
        <button {...getToggleButtonProps()} aria-label="toggle menu">
          &#8595;
        </button>
      </div>
      <ul {...getMenuProps()} className="autoCompleteMenu">
        {isOpen &&
          inputItems.map((item, index) => (
            <li
              className={highlightedIndex === index ? "highlightedMenuItem" : ""}
              key={`${index}`}
              {...getItemProps({ item: item.label, index })}
            >
              {item.label}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default AutoCompleteField;
