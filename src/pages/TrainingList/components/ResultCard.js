import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import "../trainingList.css";

const ResultCard = ({item, type}) => {
  return (
    <div className={"resultCard "+type}>

        {type==="training"?<div className="trainingTitle">{item.title}</div>:""}
        <div className="company">{type==="training"?item.school:item.company}</div>
        <div className="address"><FontAwesomeIcon icon={faMapMarkerAlt} />{" "+item.address}</div>
        {type==="job"?<div className="address"><FontAwesomeIcon icon={faUserFriends} />{" "+item.people}</div>:""}

        <div className="expandButton">
            Voir le détail
        </div>

        <div className="favoriteButton">
            <FontAwesomeIcon icon={faHeart} />
        </div>


        <div style={{"clear":"both"}} />

    </div>
  );
};

export default ResultCard;
