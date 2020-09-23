import React from "react";
import { setSelectedItem } from "../../../redux/Training/actions";
import { useDispatch } from "react-redux";
import { getTrainingSchoolName, getTrainingAddress } from "../../../utils/formations";
import { getJobAddress } from "../../../utils/jobs";
import { gtag } from "../../../services/googleAnalytics";
import { logError } from "../../../utils/tools";
import { ErrorMessage } from "../../../components";

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
    try {
      if (type === "job") {
        const list = item.jobs;

        if (list.length > 1) {
          return getJobs(list);
        } else {
          const job = list[0];
          if (job.type === "peJob")
            return (
              <>
                <div className="mapboxPopupTitle">{job.intitule}</div>
                <div className="mapboxPopupAddress">{getJobAddress(job)}</div>
                <div className="knowMore">
                  <button className={`gtmSavoirPlus gtmPeJob gtmMap`} onClick={() => openJobDetail(job)}>
                    En savoir plus
                  </button>
                </div>
              </>
            );
          else if (job.type === "lbb" || job.type === "lba")
            return (
              <>
                <div className="mapboxPopupTitle">{job.name}</div>
                <div className="mapboxPopupAddress">{getJobAddress(job)}</div>
                <div className="knowMore">
                  <button className={`gtmSavoirPlus gtm${job.type} gtmMap`} onClick={() => openJobDetail(job)}>
                    En savoir plus
                  </button>
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
    } catch (err) {
      logError(`Popup error ${type}`, err);
      console.log("Erreur de format des éléments emplois : ", type, item);
      return (
        <ErrorMessage
          message={
            <div className="popupError">
              Le format de l'élément sélectionné est erroné.
              <br />
              <br />
              Veuillez accepter nos excuses.
              <br />
              L'équipe Labonnealternance.
            </div>
          }
        />
      );
    }
  };

  const getJobs = (list) => {
    let result = (
      <>
        <div className="mapboxPopupTitle">Opportunités d'emploi : </div>
        <div className="mapboxPopupAddress">{getJobAddress(list[0])}</div>

        <ul>
          {list.map((job, idx) => (
            <li onClick={() => openJobDetail(job)} key={idx}>
              {job.type === "peJob" ? `${job.intitule}` : `${job.name}`}
            </li>
          ))}
        </ul>
      </>
    );
    return result;
  };

  const getTrainings = (list) => {
    let result = (
      <>
        {list.map((training, idx) => (
          <li className={`gtmSavoirPlus gtmFormation gtmMap`} onClick={() => openTrainingDetail(training)} key={idx}>
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
