import React from "react";

const FilterButton = ({ type, count }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    console.log("click :", type);
  };

  const getText = () => {
    if (type === "all") return "Voir tout";

    return `${count} ${type === "trainings" ? "formations" : "entreprises"}`;
  };

  return (
    <button onClick={handleClick} className={`filterButton${type}`}>
      {getText()}
    </button>
  );
};

export default FilterButton;
