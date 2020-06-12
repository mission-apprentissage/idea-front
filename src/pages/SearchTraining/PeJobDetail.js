import React, { useEffect } from "react";
import moment from "moment";

const PeJobDetail = ({ job }) => {
  //console.log("peJob : ", job);

  useEffect(() => {
    try {
      document.getElementsByClassName("rightCol")[0].scrollTo(0, 0);
    } catch (err) {}
  });

  return (
    <>
      <div className="itemDetailBody">
        <div className="title">En savoir plus</div>
        <div className="sectionTitle">{job.intitule}</div>
        <br />
        Publié le {moment(job.dateCreation).format("DD / MM / YYYY")}
        <br />
        Durée : {job.typeContratLibelle}
        <br />
        Rythme : {job.dureeTravailLibelle}
        <br />
        <br />
        <div className="sectionTitle">Description de l'offre</div>
        <div className="description">{job.description}</div>
        <br />
        <div className="sectionTitle">Postuler</div>
        {job.contact ? (
          <div className="description">
            {job.contact.nom ? (
              <>
                {job.contact.nom}
                <br />
              </>
            ) : (
              ""
            )}
            {job.contact.coordonnees1 ? (
              <>
                {job.contact.coordonnees1}
                <br />
              </>
            ) : (
              ""
            )}
            {job.contact.coordonnees2 ? (
              <>
                {job.contact.coordonnees2}
                <br />
              </>
            ) : (
              ""
            )}
            {job.contact.coordonnees3 ? (
              <>
                {job.contact.coordonnees3}
                <br />
              </>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        <div className="blueAdvice">
          Optimisez votre recherche en envoyant aussi des candidatures spontanées aux entreprises qui n’ont pas diffusé
          d’offre !
        </div>
      </div>
    </>
  );
};

export default PeJobDetail;
