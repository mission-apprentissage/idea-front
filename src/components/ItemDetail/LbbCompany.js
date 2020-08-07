import React from "react";
import jobIcon from "../../assets/icons/job.svg";
import companySizeIcon from "../../assets/icons/employees.svg";
import { useSelector } from "react-redux";

const LbbCompany = ({ company, handleSelectItem, showTextOnly, searchForTrainingsCenteredOnCompany }) => {
  //console.log("lbb company : ", company);
  const { formValues } = useSelector((state) => state.trainings);

  const onSelectItem = () => {
    handleSelectItem(company, company.type);
  };

  const getCenterSearchOnCompanyButton = () => {
    return (
      <button className="extendedTrainingSearchButton" onClick={centerSearchOnCompany}>
        Chercher les formations proches de cette entreprise
      </button>
    );
  };

  const centerSearchOnCompany = () => {
    searchForTrainingsCenteredOnCompany(company);
  };

  return (
    <div className="resultCard">
      <div id={`${company.type}${company.siret}`}>
        <img className="cardIcon" src={jobIcon} alt="" />
        <span className="cardDistance">{company.distance} km(s) du lieu de recherche</span>
      </div>

      <div className="title">{company.name}</div>
      <div className="body">
        <div className="companyAddress">{company.address}</div>
        {company.headcount_text ? (
          <div className="companySize">
            <img src={companySizeIcon} alt="" />{" "}
            {company.headcount_text && company.headcount_text === "0 salarié"
              ? "petite entreprise"
              : company.headcount_text}
          </div>
        ) : (
          ""
        )}
      </div>

      {showTextOnly ? (
        ""
      ) : (
        <>
          {Math.round(company.distance) > formValues.locationRadius ? getCenterSearchOnCompanyButton() : ""}
          <div onClick={onSelectItem} className="knowMore">
            <a href="#">En savoir plus</a>
          </div>
        </>
      )}
    </div>
  );
};

export default LbbCompany;
