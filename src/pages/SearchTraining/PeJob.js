import React from "react";
import jobIcon from "../../assets/icons/job.svg";
import companySizeIcon from "../../assets/icons/employees.svg";

const PeJob = ({ job, handleSelectItem }) => {
  //console.log("peJob : ", job);

  const onSelectItem = () => 
  {
    handleSelectItem(job,"pe");
  };

  return (
    <div className="resultCard">
      <div>
        <img className="cardIcon" src={jobIcon} alt="" />
        <span className="cardDistance">{job.distance} km(s) du lieu de recherche</span>
      </div>

      <div className="title">{job.entreprise ? job.entreprise.nom : ""}</div>
      <div className="body">
        {job.intitule}
        <div className="companyAddress">{job.lieuTravail.libelle}</div>
        {job.trancheEffectifEtab ? (
          <div className="companySize">
            <img src={companySizeIcon} alt="" /> {job.trancheEffectifEtab}
          </div>
        ) : (
          ""
        )}

        <div className="hasJob">L'entreprise propose 1 offre d'emploi pour cette formation</div>
      </div>

      <div onClick={onSelectItem} className="knowMore">
        <a href="#">En savoir plus</a>
      </div>
    </div>
  );
};

export default PeJob;
