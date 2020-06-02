import React from "react";

const Training = ({ training }) => {
  return (
    <div className="resultCard">
      <div className="title">{training.source.intitule_long}</div>
      <div className="body">
        {training.source.onisep_url ? (
          <a href={training.source.onisep_url} target="_blank" rel="noopener noreferrer">
            Lien ONISEP
          </a>
        ) : (
          ""
        )}
        <br />
        Diplôme : {training.source.diplome}
        <br />
        Code postal : {training.source.code_postal} - Distance : {Math.round(training.sort[0])} km(s)
      </div>
    </div>
  );
};

export default Training;
