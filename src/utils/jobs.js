import React from "react";

const getJobAddress = ({ type, lieuTravail, address, entreprise }) => {
  if (type === "peJob")
    return (
      <>
        {entreprise && entreprise.nom ? entreprise.nom : ""}
        <br />
        {lieuTravail.libelle}
      </>
    );
  else return address;
};

export { getJobAddress };
