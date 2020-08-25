import React from "react";
import jobIcon from "../../assets/icons/job.svg";
import companySizeIcon from "../../assets/icons/employees.svg";
import { useSelector } from "react-redux";

const PeJob = ({ job, handleSelectItem, showTextOnly, searchForTrainingsOnNewCenter }) => {
  const { formValues } = useSelector((state) => state.trainings);

  const onSelectItem = () => {
    handleSelectItem(job, "peJob");
  };

  const getCenterSearchOnPeJobButton = () => {
    return (
      <button className="extendedTrainingSearchButton" onClick={centerSearchOnPeJob}>
        Chercher les formations proches de cette entreprise
      </button>
    );
  };

  const centerSearchOnPeJob = () => {
    /* job contient . commune est le code insee
    lieuTravail:
      codePostal: "15000"
      commune: "15267"
      distance: 43
      latitude: 44.91194444
      libelle: "15 - YTRAC"
      longitude: 2.3625*/
    let lT = job.lieuTravail;

    const newCenter = {
      insee: lT.commune,
      label: lT.libelle,
      zipcode: lT.codePostal,
      value: {
        type: "Point",
        coordinates: [lT.longitude, lT.latitude],
      },
    };

    searchForTrainingsOnNewCenter(newCenter);
  };

  return (
    <div className="resultCard">
      <div id={`id${job.id}`}>
        <img className="cardIcon" src={jobIcon} alt="" />
        <span className="cardDistance">{job.lieuTravail.distance} km(s) du lieu de recherche</span>
      </div>

      <div className="title">{job.entreprise ? job.entreprise.nom : ""}</div>
      <div className="body">
        {job.intitule}
        <div className="companyAddress">{job.lieuTravail.libelle}</div>
        {job.trancheEffectifEtab ? (
          <div className="companySize">
            <img src={companySizeIcon} alt="" />
            {job.trancheEffectifEtab && job.trancheEffectifEtab === "0 salarié"
              ? "petite entreprise"
              : job.trancheEffectifEtab}
          </div>
        ) : (
          ""
        )}

        <div className="hasJob">L'entreprise propose 1 offre d'emploi pour cette formation</div>
      </div>

      {showTextOnly ? (
        ""
      ) : (
        <>
          {Math.round(job.lieuTravail.distance) > formValues.locationRadius ? getCenterSearchOnPeJobButton() : ""}
          <div className="knowMore">
            <button onClick={onSelectItem}>En savoir plus</button>
          </div>
        </>
      )}
    </div>
  );
};

export default PeJob;
