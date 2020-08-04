import React from "react";
import trainingIcon from "../../assets/icons/school.svg";
import { getTrainingSchoolName, getTrainingAddress } from "../../utils/formations";
import { useSelector } from "react-redux";

const Training = ({ training, handleSelectItem, showTextOnly, searchForJobsCenteredOnTraining, isTrainingOnly }) => {
  const { formValues } = useSelector((state) => state.trainings);

  const onSelectItem = () => {
    handleSelectItem(training, "training");
  };

  const getCenterSearchOnTrainingButton = () => {
    return (
      <button className="extendedJobSearchButton" onClick={centerSearchOnTraining}>
        Voir les entreprises proches proches du lieu de formation
      </button>
    );
  };

  const centerSearchOnTraining = () => {
    searchForJobsCenteredOnTraining(training);
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
        <>
          {Math.round(training.sort[0]) > formValues.locationRadius && !isTrainingOnly
            ? getCenterSearchOnTrainingButton()
            : ""}
          <div onClick={onSelectItem} className="knowMore">
            <a href="#">En savoir plus</a>
          </div>
        </>
      )}
    </div>
  );
};

export default Training;
