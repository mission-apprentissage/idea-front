import React from "react";
import trainingIcon from "../../../assets/icons/training_filter.svg";
import jobIcon from "../../../assets/icons/job_filter.svg";
import inactiveTrainingIcon from "../../../assets/icons/training_filter_inactive.svg";
import inactiveJobIcon from "../../../assets/icons/job_filter_inactive.svg";

const FilterButton = ({ type, count, isActive, handleFilterButtonClicked }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    if (!isActive) handleFilterButtonClicked(type);
  };

  const getIcon = () => {
    let src = "";
    if (type === "trainings") src = isActive ? trainingIcon : inactiveTrainingIcon;
    else if (type === "jobs") src = isActive ? jobIcon : inactiveJobIcon;

    return src ? <img src={src} alt="" /> : "";
  };

  const getText = () => {
    if (type === "all") return "Voir tout";

    return `${count} ${type === "trainings" ? "formations" : "entreprises"}`;
  };

  return (
    <button
      onClick={handleClick}
      className={`gtmFilterButton gtmFilterButton${type} filterButton${type}${isActive ? " active" : ""}`}
    >
      {getIcon()}
      {getText()}
    </button>
  );
};

export default FilterButton;
