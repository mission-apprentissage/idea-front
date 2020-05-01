import React, { useState } from "react";
import { useField, useFormikContext } from "formik";
import { useCombobox } from 'downshift'

const items = [ {value:"a",label:"Bleu"},
{value:"b",label:"rouge"},
{value:"c",label:"Vert"} ];

const menuStyles = {
  maxHeight: "180px",
  overflowY: "auto",
  width: "135px",
  margin: 0,
  borderTop: 0,
  background: "white",
  position: "absolute",
  zIndex: 1000,
  listStyle: "none",
  padding: 0,
  left: "135px"
};

const itemToString = (item) => { return item ? item.label : ""; };

export const AutoCompleteField = ({ ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  
  const [inputItems, setInputItems] = useState( items );
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
      setInputItems(
        items.filter(item =>
          item.label.toLowerCase().startsWith(inputValue.toLowerCase()),
        ),
      )
    },
  })
  return (
    <div>
      <label {...getLabelProps()}>Choose an element:</label>
      <div  {...getComboboxProps()}>
        <input {...getInputProps()} />
        <button {...getToggleButtonProps()} aria-label="toggle menu">
          &#8595;
        </button>
      </div>
      <ul {...getMenuProps()} style={menuStyles} >
        {isOpen &&
          inputItems.map((item, index) => (
            <li
              style={
                highlightedIndex === index
                  ? { backgroundColor: '#bde4ff' }
                  : {}
              }
              key={`${item.value}${index}`}
              {...getItemProps({ item:item.label, index })}
            >
              {item.label}
            </li>
          ))}
      </ul>
    </div>
  )
};

export default AutoCompleteField;
