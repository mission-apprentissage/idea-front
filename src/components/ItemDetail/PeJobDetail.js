import React, { useEffect } from "react";
import moment from "moment";
import { gtag } from "../../services/googleAnalytics";
import infoIcon from "../../assets/icons/info.svg";
import linkIcon from "../../assets/icons/link.svg";

const PeJobDetail = ({ job }) => {
  //console.log("peJob : ", job);

  useEffect(() => {
    try {
      document.getElementsByClassName("rightCol")[0].scrollTo(0, 0);
    } catch (err) {}
  });

  const logClickedLink = (label) => {
    gtag("Lien", "Clic", label, { type: "peJob" });
  };

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
        {job.contact ? (
          <>
            <div className="sectionTitle">Postuler</div>
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
              <br />
            </div>
          </>
        ) : (
          ""
        )}
        <div className="sectionTitle">Retrouvez l'offre sur Pôle emploi</div>
        <div>
          <a
            target="poleemploi"
            href={`https://candidat.pole-emploi.fr/offres/recherche/detail/${job.id}`}
            onClick={() => {
              logClickedLink("Offre Pôle emploi");
            }}
          >
            <img className="linkIcon" src={linkIcon} alt="" />{" "}
            {`https://candidat.pole-emploi.fr/offres/recherche/detail/${job.id}`}
          </a>
        </div>
        <div className="blueAdvice">
          <div className="floatLeft">
            <img src={infoIcon} alt="" />
          </div>
          <div className="paragraph">
            Optimisez votre recherche en envoyant aussi des candidatures spontanées aux entreprises qui n’ont pas
            diffusé d’offre !
          </div>
        </div>
      </div>
    </>
  );
};

export default PeJobDetail;
