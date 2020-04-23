import React from "react";
import "../trainingList.css";
import { Spinner } from "reactstrap";

const LoadingResults = () => {
  return (
    <div className="loadingResults">
      Nous recherchons des résultats pour vous.
      <br /><br />
      Merci de patienter :)
      <br /><br />
      <Spinner />
    </div>
  );
};

export default LoadingResults;
