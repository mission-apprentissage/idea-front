import React from "react";
import "../trainingList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSlidersH } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const ReducedResultFilter = () => {
  const { job } = useSelector((state) => state.filters);

  return (
    <div className="activeFilters">
      <div>
        <div className="fa-icon left">
          <FontAwesomeIcon icon={faSearch} />
        </div>
        <div className="inputText">
          <input type="text" placeholder={job.label} value={job.label} />
        </div>
        <div className="fa-icon right">
          <FontAwesomeIcon icon={faSlidersH} />
        </div>
      </div>
    </div>
  );
};

export default ReducedResultFilter;
