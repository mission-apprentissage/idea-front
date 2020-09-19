import React from "react";
import "./spinner.css";

const Spinner = () => {
  return (
    <div className="spinner">
      <div>
        <i className="fa fa-spinner fa-spin"></i>
      </div>
      Chargement en cours, veuillez patienter :)
    </div>
  );
};

export default Spinner;
