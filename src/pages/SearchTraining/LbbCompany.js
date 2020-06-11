import React from "react";
import jobIcon from "../../assets/icons/job.svg";
import companySizeIcon from "../../assets/icons/employees.svg";

const LbbCompany = ({ company, handleSelectItem, showTextOnly }) => {
  //console.log("lbb company : ", company);

  const onSelectItem = () => {
    handleSelectItem(company, "lbb");
  };

  return (
    <div className="resultCard">
      <div>
        <img className="cardIcon" src={jobIcon} alt="" />
        <span className="cardDistance">{company.distance} km(s) du lieu de recherche</span>
      </div>

      <div className="title">{company.name}</div>
      <div className="body">
        <div className="companyAddress">{company.address}</div>
        {company.headcount_text ? (
          <div className="companySize">
            <img src={companySizeIcon} alt="" /> {company.headcount_text}
          </div>
        ) : (
          ""
        )}
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

export default LbbCompany;
