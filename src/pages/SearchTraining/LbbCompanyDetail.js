import React, { useEffect } from "react";

const LbbCompanyDetail = ({ company }) => {
  //console.log("lbb : ", company);

  useEffect(() => {
    try {
      document.getElementsByClassName("rightCol")[0].scrollTo(0, 0);
    } catch (err) {}
  });

  return (
    <>
      <div className="itemDetailBody">
        <div className="title">En savoir plus</div>
        <div className="description">
          {company.website ? (
            <>
              Site Internet :{" "}
              <a href={company.website} target="_blank">
                {company.website}
              </a>
              <br />
            </>
          ) : (
            ""
          )}
        </div>
        <div className="sectionTitle">Voir la fiche entreprise sur le site La Bonne Alternance</div>
        <div className="description">
          <a target="lbb" href={company.url}>
            https://labonnealternance.pole-emploi.fr/details-entreprises
          </a>
        </div>
      </div>
    </>
  );
};

export default LbbCompanyDetail;
