import React from "react";
import jobIcon from "../../assets/icons/job.svg";
import companySizeIcon from "../../assets/icons/employees.svg";
import { useSelector } from "react-redux";
import { fetchAddresses } from "../../services/baseAdresse";
import { gtag } from "../../services/googleAnalytics";

const LbbCompany = ({ company, handleSelectItem, showTextOnly, searchForTrainingsOnNewCenter }) => {
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

  const centerSearchOnCompany = async () => {
    /* 
    company contient :
    address: "72 AVENUE VICTOR HUGO, 24120 TERRASSON-LAVILLEDIEU"
    city: "TERRASSON-LAVILLEDIEU"
    lat: 45.1304
    lon: 1.29579
    */

    // récupération du code insee depuis la base d'adresse
    const addresses = await fetchAddresses(company.address, "municipality");
    let insee = "";
    let zipcode = "";
    if (addresses.length) {
      insee = addresses[0].insee;
      zipcode = addresses[0].zipcode;
    }

    const newCenter = {
      insee,
      label: company.address,
      zipcode,
      value: {
        type: "Point",
        coordinates: [company.lon, company.lat],
      },
    };

    gtag("Bouton", "Clic", "Centrage recherche - " + company.type);

    searchForTrainingsOnNewCenter(newCenter);
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
