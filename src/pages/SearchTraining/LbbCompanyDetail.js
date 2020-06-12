import React, { useEffect } from "react";

const LbbCompanyDetail = ({ company }) => {
  console.log("lbb : ", company);

  useEffect(() => {
    try {
      document.getElementsByClassName("rightCol")[0].scrollTo(0, 0);
    } catch (err) {}
  });

  return (
    <>
      <div className="itemDetailBody">
        <div className="title">En savoir plus</div>
        {/*<div className="sectionTitle">{company.intitule}</div>
        <br />
        Durée : {company.typeContratLibelle}
        <br />
        Rythme : {company.dureeTravailLibelle}
        <br />
        <br />
        <div className="sectionTitle">Description de l'offre</div>
        <div className="description">{company.description}</div>
        <br />
        <div className="sectionTitle">Postuler</div>
        <div className="description">
          {company.contact.nom ? (
            <>
              {company.contact.nom}
              <br />
            </>
          ) : (
            ""
          )}
          {company.contact.coordonnees1 ? (
            <>
              {company.contact.coordonnees1}
              <br />
            </>
          ) : (
            ""
          )}
          {company.contact.coordonnees2 ? (
            <>
              {company.contact.coordonnees2}
              <br />
            </>
          ) : (
            ""
          )}
          {company.contact.coordonnees3 ? (
            <>
              {company.contact.coordonnees3}
              <br />
            </>
          ) : (
            ""
          )}
        </div>
        <div className="blueAdvice">
          Optimisez votre recherche en envoyant aussi des candidatures spontanées aux entreprises qui n’ont pas diffusé
          d’offre !
          </div>*/}
      </div>
    </>
  );
};

export default LbbCompanyDetail;
