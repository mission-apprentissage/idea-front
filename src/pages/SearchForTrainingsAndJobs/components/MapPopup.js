import React from "react";
import { setSelectedItem } from "../../../redux/Training/actions";
import { useDispatch } from "react-redux";
import { getTrainingSchoolName, getTrainingAddress } from "../../../utils/formations";
import { gtag } from "../../../services/googleAnalytics";

const MapPopup = ({ type, item, handleSelectItem }) => {
  const dispatch = useDispatch();

  const openJobDetail = (job) => {
    dispatch(setSelectedItem({ item: job, type: job.type }));

    gtag("Bouton", "Clic", "Ouverture fiche", { source: "map", type: job.type });
    handleSelectItem();
  };

  const openTrainingDetail = (training) => {
    dispatch(setSelectedItem({ item: training, type: "training" }));

    gtag("Bouton", "Clic", "Ouverture fiche", { source: "map", type: "training" });
    handleSelectItem();
  };

  const getContent = () => {
    if (type === "job") {
      const list = item.jobs;

      if (list.length > 1) {
        return <ul>{getJobs(list)}</ul>;
      } else {
        const job = list[0];
        if (job.type === "peJob")
          return (
            <>
              <div className="mapboxPopupTitle">{job.intitule}</div>
              <div className="mapboxPopupAddress">
                {job.entreprise ? job.entreprise.nom : ""}
                <br />
                {job.lieuTravail.libelle}
              </div>
              <div className="knowMore">
                <button onClick={() => openJobDetail(job)}>En savoir plus</button>
              </div>
            </>
          );
        else if (job.type === "lbb" || job.type === "lba")
          return (
            <>
              <div className="mapboxPopupTitle">{job.name}</div>
              <div className="mapboxPopupAddress">{job.address}</div>
              <div className="knowMore">
                <button onClick={() => openJobDetail(job)}>En savoir plus</button>
              </div>
            </>
          );
      }
    } else {
      const list = item.trainings;

      return (
        <>
          <div className="mapboxPopupTitle">Formations à : </div>
          <div className="mapboxPopupAddress">
            {getTrainingSchoolName(list[0].source, "lowerCase")}
            <br />
            {getTrainingAddress(list[0].source, "lowerCase")}
          </div>
          <ul>{getTrainings(list)}</ul>
        </>
      );
    }
  };

  const getJobs = (list) => {
    let result = (
      <>
        Plusieurs opportunités d'emploi à l'adresse :
        <br />
        {list.map((job, idx) => (
          <li onClick={() => openJobDetail(job)} key={idx}>
            {job.type === "peJob" ? `${job.intitule}` : `${job.name}`}
          </li>
        ))}
      </>
    );
    return result;
  };

  const getTrainings = (list) => {
    let result = (
      <>
        {list.map((training, idx) => (
          <li onClick={() => openTrainingDetail(training)} key={idx}>
            {training.source.nom ? training.source.nom : training.source.intitule_long}
          </li>
        ))}
      </>
    );
    return result;
  };

  return getContent();
};

export default MapPopup;
