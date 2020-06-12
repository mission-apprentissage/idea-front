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
        <span className="bold">{company.name}</span> a déjà pris des apprenti-e-s par le passé !
        <br />
        <br />
        {company.website ? (
          <>
            Site Internet :{" "}
            <a href={company.website} target="_blank">
              {company.website}
            </a>
            <br />
            <br />
          </>
        ) : (
          ""
        )}
        <div className="sectionTitle">Voir la fiche entreprise sur le site La Bonne Alternance</div>
        <div className="description">
          <a target="lbb" href={company.url}>
            https://labonnealternance.pole-emploi.fr/details-entreprises
          </a>
        </div>

        <div className="blueAdvice">
          <span className="bold">C'est quoi une candidature spontanée ?</span>
          <br />
          <br />
          L'entreprise n'a pas déposé d'offre d'emploi, vous pouvez tout de même lui envoyer votre CV pour lui indiquer
          que vous seriez très intéressé pour intégrer son équipe dans le cadre de votre alternance.
        </div>
      </div>
    </>
  );
};

export default LbbCompanyDetail;
