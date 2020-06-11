import React from "react";
import { setSelectedItem } from "../../redux/Training/actions";
import { useDispatch } from "react-redux";

const MapPopup = ({ type, item }) => {
  const dispatch = useDispatch();

  const openItemDetail = () => {
    dispatch(setSelectedItem({ item, type }));
  };

  const openTrainingDetail = (training) => {
    dispatch(setSelectedItem({ item: training, type: "training" }));
  };

  const getContent = () => {
    if (type === "pe")
      return (
        <>
          <div className="mapboxPopupTitle">{item.intitule}</div>
          <div className="mapboxPopupAddress">
            {item.entreprise ? item.entreprise.nom : ""}
            <br />
            {item.lieuTravail.libelle}
          </div>
          <div onClick={openItemDetail} className="knowMore">
            <a href="#">En savoir plus</a>
          </div>
        </>
      );
    else if (type === "lbb")
      return (
        <>
          <div className="mapboxPopupTitle">{item.name}</div>
          <div className="mapboxPopupAddress">{item.address}</div>
          <div onClick={openItemDetail} className="knowMore">
            <a href="#">En savoir plus</a>
          </div>
        </>
      );
    else {
      const list = item.trainings;

      return (
        <>
          <div className="mapboxPopupTitle">Formations à : </div>
          <div className="mapboxPopupAddress">
            {list[0].source.entreprise_raison_sociale.toLowerCase()}
            <br />
            {list[0].source.adresse.toLowerCase()}
          </div>
          <ul>{getTrainings(list)}</ul>
        </>
      );
    }
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
