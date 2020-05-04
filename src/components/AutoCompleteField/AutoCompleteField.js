import React, { useState } from "react";
import { useField, useFormikContext } from "formik";
import { useCombobox } from "downshift";
import axios from "axios";
import "./AutoCompleteField.css";

export const AutoCompleteField = ({
  itemToStringFunction,
  onInputValueChangeFunction,
  onSelectedItemChangeFunction,
  initialItem,
  items,
  ...props
}) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);

  const [inputItems, setInputItems] = useState(items);

  const itemToString = (item) => {
    if (itemToStringFunction) return item ? itemToStringFunction(item) : "";
    else return item;
  };

  const fetchAddresses = (value) => {
    const addressURL = `https://api-adresse.data.gouv.fr/search/?limit=15&q=${value}`;
    console.log(addressURL);
    return axios.get(addressURL).then((response) => {
      //this.setState({ movies: response.data.results })
      console.log(response.data.features);
      const returnedItems = response.data.features.map((feature) => {
        console.log(feature);
        return { value: feature.geometry, label: feature.properties.label };
      });

      console.log("returned items : ", returnedItems);

      return returnedItems;
      //setInputItems(returnedItems);
    });
  };

  const setFieldValueFormik = (item) => {
    //setFieldValue("jobSelectorLabel",value );
    setTimeout(() => {
      setFieldValue("jobSelectorLabel", item.label);
      setFieldValue("jobSelectorValue", item.value);
    }, 0);
  };

  const {
    isOpen,
    /*getToggleButtonProps,
    getLabelProps,*/
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: inputItems,
    itemToString,
    initialSelectedItem: initialItem,
    onSelectedItemChange: ({ selectedItem }) => {       //
      if (onSelectedItemChangeFunction) onSelectedItemChangeFunction(selectedItem, setFieldValue);
    },
    onInputValueChange: ({ inputValue, selectedItem }) => {
      //console.log("returnedItems : ", fetchAddresses(inputValue));
      if (onInputValueChangeFunction) setInputItems(onInputValueChangeFunction(inputValue));
      else setInputItems(items.filter((item) => item.label.toLowerCase().startsWith(inputValue.toLowerCase())));

      onSelectedItemChangeFunction(null, setFieldValue);
    },
  });
  return (
    <div className="autoCompleteContainer">
      {/*<label {...getLabelProps()}>Possibilité de poser un label avec des props dédiées</label>*/}
      <div {...getComboboxProps()}>
        <input {...getInputProps()} placeholder={props.placeholder} />
        {/*<button {...getToggleButtonProps()} aria-label="toggle menu">
          &#8595;   possibilité de poser un bouton toggle avec des props dédiées
        </button>*/}
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
