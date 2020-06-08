import React from "react";
import trainingIcon from "../../assets/icons/school.svg";

const Training = ({ training }) => {
  return (
    <div className="resultCard trainingCard">
      <div>
        <img className="cardIcon" src={trainingIcon} />
        <span className="cardDistance">{Math.round(training.sort[0])} km(s) du lieu de recherche</span>
      </div>
      <div className="title">{training.source.rncp_intitule}</div>
      <div className="body">
        {training.source.entreprise_raison_sociale}
        <div className="companyAddress">{training.source.adresse}</div>
        {training.source.onisep_url ? (
          <div>
            <a href={training.source.onisep_url} target="_blank" rel="noopener noreferrer">
              Lien ONISEP
            </a>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="knowMore">
        <a href="#">En savoir plus</a>
      </div>
    </div>
  );
};

export default Training;