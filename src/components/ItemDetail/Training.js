import React from "react";
import trainingIcon from "../../assets/icons/school.svg";
import { getTrainingSchoolName, getTrainingAddress } from "../../utils/formations";
const Training = ({ training, handleSelectItem, showTextOnly }) => {
  const onSelectItem = () => {
    handleSelectItem(training, "training");
  };

  return (
    <div className="resultCard trainingCard">
      <div id={`id${training.id}`}>
        <img className="cardIcon" src={trainingIcon} alt="" />
        <span className="cardDistance">{Math.round(training.sort[0])} km(s) du lieu de recherche</span>
      </div>
      <div className="title">{training.source.nom ? training.source.nom : training.source.intitule_long}</div>
      <div className="body">
        {getTrainingSchoolName(training.source)}
        <div className="companyAddress">{getTrainingAddress(training.source)}</div>
      </div>
      {showTextOnly ? (
        ""
      ) : (
        <div onClick={onSelectItem} className="knowMore">
          <a href="#">En savoir plus</a>
        </div>
      )}
    </div>
  );
};

export default Training;
