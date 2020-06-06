import React from "react";
import trainingIcon from "../../assets/icons/school.svg";

const Training = ({ training }) => {
  return (
    <div className="resultCard trainingCard">
      <div>
        <img className="cardIcon" src={trainingIcon} />
        <span className="cardDistance">{Math.round(training.sort[0])} km(s) du lieu de recherche</span>
      </div>
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
        Code postal : {training.source.code_postal} 
      </div>
    </div>
  );
};

export default Training;
