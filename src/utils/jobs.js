import React from "react";

const getJobAddress = (job) => {
  if (job.type === "peJob")
    return (
      <>
        {job.entreprise ? job.entreprise.nom : ""}
        <br />
        {job.lieuTravail.libelle}
      </>
    );
  else return job.address;
};

export { getJobAddress };
