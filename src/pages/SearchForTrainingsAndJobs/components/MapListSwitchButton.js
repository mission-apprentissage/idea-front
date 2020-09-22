import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { Button } from "reactstrap";

const MapListSwitchButton = ({ visiblePane, hasSearch, showResultMap, showSearchForm, showResultList }) => {
  if (visiblePane === "resultList") {
    if (hasSearch)
      return (
        <div className="floatingButtons resultList">
          <Button onClick={showResultMap}>
            <FontAwesomeIcon icon={faMapMarkerAlt} /> Carte
          </Button>
        </div>
      );
    else return "";
  } else {
    return (
      <div className="floatingButtons resultMap">
        <Button onClick={showSearchForm}>Filtres</Button>
        {hasSearch ? <Button onClick={showResultList}>Liste</Button> : ""}
      </div>
    );
  }
};

export default MapListSwitchButton;
