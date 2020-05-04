import React, { useState } from "react";
import { /*useField,*/ useFormikContext } from "formik";
import { useCombobox } from "downshift";
//import axios from "axios";
import "./AutoCompleteField.css";

export const AutoCompleteField = ({
  itemToStringFunction,
  onInputValueChangeFunction,
  onSelectedItemChangeFunction,
  compareItemFunction,
  initialItem,
  items,
  initialIsOpen,
  ...props
}) => {
  const { setFieldValue } = useFormikContext();
  //const [field] = useField(props);

  const [inputItems, setInputItems] = useState(items);

  const itemToString = (item) => {
    if (itemToStringFunction) return item ? itemToStringFunction(item) : "";
    else return item;
  };

  /*
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
  };*/

  const {
    isOpen,
    /*getToggleButtonProps,
    getLabelProps,*/
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectItem,
  } = useCombobox({
    items: inputItems,
    itemToString,
    initialSelectedItem: initialItem,
    initialIsOpen,
    onSelectedItemChange: ({ selectedItem }) => {
      // modifie les valeurs sélectionnées du formulaire en fonction de l'item sélectionné
      if (onSelectedItemChangeFunction) onSelectedItemChangeFunction(selectedItem, setFieldValue);
    },
    onInputValueChange: ({ inputValue }) => {
      // fixe la liste d'items en fonction de la valeur courante du champ input. S'il y a appel à une API c'est ici
      if (onInputValueChangeFunction) setInputItems(onInputValueChangeFunction(inputValue));
      else setInputItems(items.filter((item) => item.label.toLowerCase().startsWith(inputValue.toLowerCase())));

      // sélectionne ou désélectionne l'objet en fonction des modifications au clavier de l'utilisateur
      if (compareItemFunction) {
        const itemIndex = compareItemFunction(inputItems, inputValue);
        if (itemIndex >= 0) selectItem(inputItems[itemIndex]);
        else selectItem(null);
      }
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
