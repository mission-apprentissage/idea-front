import React from "react";
import "./errorMessage.css";
import errorAlertIcon from "../../assets/icons/errorAlert.svg";

const ErrorMessage = ({ type, message }) => {

    console.log("message : ",message);

  return (
    <div className="errorMessage">
      <img src={errorAlertIcon} alt="" />
      {message}
    </div>
  );
};

export default ErrorMessage;
