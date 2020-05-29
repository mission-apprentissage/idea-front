import React from "react";

const PeJob = ({ job }) => {
  console.log("peJob : ", job);

  return (
    <div className="resultCard">
      <div className="title">{job.intitule}</div>
      <div className="body">
        {job.entreprise.nom}
        <br />
        {job.natureContrat} {job.typeContrat}
        <br />
        Lieu : {job.lieuTravail.libelle} - Distance : à calculer km(s)
      </div>
    </div>
  );
};

export default PeJob;
