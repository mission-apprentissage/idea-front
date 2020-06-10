import React from "react";

const MapPopup = ({ type, item }) => {
  const openItemDetail = () => {
    console.log("openItemDetail ", type, item);
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
            <a>En savoir plus</a>
          </div>
        </>
      );
    else if (type === "lbb") return "";
    else return "";
  };

  return getContent();
};

export default MapPopup;
