import React, { useEffect } from "react";

const TrainingDetail = ({ training }) => {
  console.log("training : ", training);

  useEffect(() => {
    try {
      document.getElementsByClassName("rightCol")[0].scrollTo(0, 0);
    } catch (err) {}
  });

  return (
    <>
      <div className="itemDetailBody">
        <div className="title">En savoir plus</div>

        {training.source.email ? (
          <>
            <div className="sectionTitle">Email de contact:</div>
            <br />
            <a href={`mailto://${training.source.email}`}>{training.source.email}</a>
          </>
        ) : (
          ""
        )}

        <div className="blueAdvice">
          {training.source.onisep_url ? (
            <a href={training.source.onisep_url} target="_blank" rel="noopener noreferrer">
              Lien ONISEP
            </a>
          ) : (
            "Pas de lien Onisep on dit quoi ?"
          )}
        </div>
      </div>
    </>
  );
};

export default TrainingDetail;
