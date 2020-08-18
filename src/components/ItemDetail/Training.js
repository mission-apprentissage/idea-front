import React from "react";
import trainingIcon from "../../assets/icons/school.svg";
import { getTrainingSchoolName, getTrainingAddress } from "../../utils/formations";
import { useSelector } from "react-redux";
import { fetchAddresses } from "../../services/baseAdresse";
import { gtag } from "../../services/googleAnalytics";

const Training = ({ training, handleSelectItem, showTextOnly, searchForJobsOnNewCenter, isTrainingOnly }) => {
  const { formValues } = useSelector((state) => state.trainings);

  const onSelectItem = () => {
    handleSelectItem(training, "training");
  };

  const getCenterSearchOnTrainingButton = () => {
    return (
      <button className="extendedJobSearchButton" onClick={centerSearchOnTraining}>
        Voir les entreprises proches du lieu de formation
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

    gtag("Bouton", "Clic", "Centrage recherche - training");
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
