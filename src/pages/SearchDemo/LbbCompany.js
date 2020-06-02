import React from "react";

const LbbCompany = ({ company }) => {
  //console.log("lbb company : ", company);

  return (
    <div className="resultCard">
      <div className="title">{company.name}</div>
      <div className="body">        
        Lieu : {company.city} - Distance : {company.distance} km(s)
      </div>
    </div>
  );
};

export default LbbCompany;
