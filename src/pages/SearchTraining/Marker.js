import React from "react";

const Marker = ({ type, item, flyToMarker }) => {
  const flyTo = () => {
    console.log("Flyto : ", item);
    flyToMarker(item);
  };

  const getCount = () => {
    if (type === "training" && item.trainings.length > 1) return <div>{item.trainings.length}</div>;
    else if (type === "job" && item.origineOffre) return <div>1</div>;
    else return "";
  };

  return (
    <div onClick={flyTo} className={`markerIcon ${type === "training" ? "trainingMarkerIcon" : "jobMarkerIcon"}`}>
      {getCount()}
    </div>
  );
};

export default Marker;
