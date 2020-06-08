import React from "react";
import jobIcon from "../../assets/icons/job.svg";

const PeJob = ({ job }) => {
  //console.log("peJob : ", job);

  return (
    <div className="resultCard">
      <div>
        <img className="cardIcon" src={jobIcon} alt="" />
        <span className="cardDistance">{job.distance} km(s) du lieu de recherche</span>
      </div>

      <div className="title">{job.intitule}</div>
      <div className="body">
        {job.entreprise ? job.entreprise.nom : ""}
        <br />
        {job.natureContrat} {job.typeContrat}
        <br />
        Lieu : {job.lieuTravail.libelle} - Distance : à calculer km(s)
      </div>
    </div>
  );
};

export default PeJob;
