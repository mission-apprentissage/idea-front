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
        <span className="bold">{company.name}</span>{" "}
        {company.type === "lba" ? "a déjà pris des apprenti-e-s par le passé !" : "est une bonne boîte"}
        <br />
        <br />
        {company.website ? (
          <>
            Site Internet :{" "}
            <a href={company.website} target="_blank" rel="noopener noreferrer">
              {company.website}
            </a>
            <br />
            <br />
          </>
        ) : (
          ""
        )}
        <div className="sectionTitle">
          Voir la fiche entreprise sur le site {company.type === "lba" ? "La Bonne Alternance" : "La Bonne Boîte"}
        </div>
        <div className="description">
          <a target="lbb" href={company.url}>
            https://{company.type === "lba" ? "labonnealternance" : "labonneboite"}.pole-emploi.fr/details-entreprises
          </a>
        </div>
        <div className="blueAdvice">
          <span className="bold">C'est quoi une candidature spontanée ?</span>
          <br />
          <br />
          L'entreprise n'a pas déposé d'offre d'emploi, vous pouvez tout de même lui envoyer votre CV pour lui indiquer
          que vous seriez très intéressé pour intégrer son équipe dans le cadre de votre alternance.
        </div>
        <div className="pinkAdvice">
          <span className="bold">Comment se préparer pour une candidature spontanée ?</span>
          <br />
          <ul>
            <li>
              Adaptez votre lettre de motivation à l'entreprise aux informations recueillies : Activité, actualités et
              valeurs.
              <br />
              Conseil : Allez voir le site de l'entreprise si elle en a un.
            </li>
            <li>
              Mettez en valeur vos qualités en lien avec le métier recherché et indiquez pourquoi vous souhaitez
              réaliser votre apprentissage dans cette entreprise en particulier.
            </li>
            <li>
              Besoin d'aide pour concevoir votre CV ? Il existe plusieurs outils gratuits :
              <br />
              <a href="https://cv.clicnjob.fr/" target="outilCV">
                https://cv.clicnjob.fr/
              </a>
              <br />
              <a href="https://cvdesignr.com/fr" target="outilCV">
                https://cvdesignr.com/fr
              </a>
              <br />
              <a href="https://www.canva.com/fr_fr/creer/cv/" target="outilCV">
                https://www.canva.com/fr_fr/creer/cv/
              </a>
              <br />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default LbbCompanyDetail;
