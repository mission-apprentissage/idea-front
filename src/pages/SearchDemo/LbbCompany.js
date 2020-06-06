import React from "react";
import jobIcon from "../../assets/icons/job.svg";

const LbbCompany = ({ company }) => {
  //console.log("lbb company : ", company);

  return (
    <div className="resultCard">
      <div>
        <img className="cardIcon" src={jobIcon} />
        <span className="cardDistance">{company.distance} km(s) du lieu de recherche</span>
      </div>
      
      <div className="title">{company.name}</div>
      <div className="body">        
        Lieu : {company.city}
      </div>
    </div>
  );
};

export default LbbCompany;
