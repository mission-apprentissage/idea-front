import React from "react";
import trainingIcon from "../../assets/icons/school.svg";
import { getTrainingSchoolName, getTrainingAddress } from "../../utils/formations";
import { useSelector } from "react-redux";
import { fetchAddresses } from "../../services/baseAdresse";
import extendedSearchPin from "../../assets/icons/jobPin.svg";

const Training = ({ training, handleSelectItem, showTextOnly, searchForJobsOnNewCenter, isTrainingOnly }) => {
  const { formValues } = useSelector((state) => state.trainings);

  const onSelectItem = () => {
    handleSelectItem(training, "training");
  };

  const getCenterSearchOnTrainingButton = () => {
    return (
      <button className="extendedJobSearchButton" onClick={centerSearchOnTraining}>
        <img src={extendedSearchPin} alt="" /> <span>Voir les entreprises proches</span>
      </button>
    );
  };

  const centerSearchOnTraining = async () => {
    // reconstruction des critères d'adresse selon l'adresse du centre de formation
    const label = `${training.source.etablissement_formateur_localite} ${training.source.etablissement_formateur_code_postal}`;
    // récupération du code insee depuis la base d'adresse
    const addresses = await fetchAddresses(label, "municipality");
    let insee = "";
    if (addresses.length) {
      insee = addresses[0].insee;
    }

    const newCenter = {
      insee,
      label,
      zipcode: training.source.etablissement_formateur_code_postal,
      value: {
        type: "Point",
        coordinates: [
          training.source.idea_geo_coordonnees_etablissement.split(",")[1],
          training.source.idea_geo_coordonnees_etablissement.split(",")[0],
        ],
      },
    };

    searchForJobsOnNewCenter(newCenter);
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
          {Math.round(training.sort[0]) > formValues.radius && !isTrainingOnly ? getCenterSearchOnTrainingButton() : ""}
          <div className="knowMore">
            <button className={`gtmSavoirPlus gtmFormation gtmListe`} onClick={onSelectItem}>
              En savoir plus
            </button>
          </div>
          <div style={{ clear: "both" }} />
        </>
      )}
    </div>
  );
};

export default Training;
