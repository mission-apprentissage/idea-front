import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Button } from "reactstrap";

const MapListSwitchButton = (props) => {
  if (props.visiblePane === "resultList") {
    return (
      <div className="floatingButtons resultList">
        <Button onClick={props.showResultMap}>
          <FontAwesomeIcon icon={faMapMarkerAlt} /> Carte
        </Button>
      </div>
    );
  } else {
    return (
      <div className="floatingButtons resultMap">
        <Button onClick={props.showSearchForm}>Filtres</Button>
        {props.hasSearch ? <Button onClick={props.showResultList}>Liste</Button> : ""}
      </div>
    );
  }
};

export default MapListSwitchButton;
