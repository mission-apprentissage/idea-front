import React from "react";
import { setSelectedItem } from "../../../redux/Training/actions";
import { useDispatch } from "react-redux";
import { getTrainingSchoolName, getTrainingAddress } from "../../../utils/formations";

const MapPopup = ({ type, item, handleSelectItem }) => {
  const dispatch = useDispatch();

  const openItemDetail = () => {
    dispatch(setSelectedItem({ item, type }));
    handleSelectItem();
  };

  const openTrainingDetail = (training) => {
    dispatch(setSelectedItem({ item: training, type: "training" }));
    handleSelectItem();
  };

  const getContent = () => {
    if (type === "peJob")
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
    else if (type === "lba")
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
            {getTrainingSchoolName(list[0].source, "lowerCase")}
            <br />
            {getTrainingAddress(list[0].source,"lowerCase")}
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
