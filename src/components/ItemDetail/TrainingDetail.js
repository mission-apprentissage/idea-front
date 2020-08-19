import React, { useEffect } from "react";
import { gtag } from "../../services/googleAnalytics";

const TrainingDetail = ({ training }) => {
  //console.log("training : ", training);

  useEffect(() => {
    try {
      document.getElementsByClassName("rightCol")[0].scrollTo(0, 0);
    } catch (err) {}
  });

  const logClickedLink = (label) => {
    gtag("Lien", "Clic", label, { type: "training" });
  };

  return (
    <>
      <div className="itemDetailBody">
        <div className="title">En savoir plus</div>

        {training.source.onisep_url ? (
          <div>
            Descriptif du{" "}
            <a
              href={training.source.onisep_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                logClickedLink("Fiche Onisep");
              }}
            >
              {training.source.nom ? training.source.nom : training.source.intitule_long}
            </a>{" "}
            sur le site Onisep
            <br />
            <br />
          </div>
        ) : (
          ""
        )}

        {training.source.email ? (
          <>
            <div className="sectionTitle">Email de contact:</div>
            <br />
            <a
              href={`mailto://${training.source.email}`}
              onClick={() => {
                logClickedLink("Email de contact");
              }}
            >
              {training.source.email}
            </a>
          </>
        ) : (
          ""
        )}

        <div className="blueAdvice">
          Idea est en version BETA
          <br />
          D'autres informations seront disponibles sur cette page prochainement
        </div>
      </div>
    </>
  );
};

export default TrainingDetail;
