import React from "react";
import { Link } from "react-router-dom";
import peopleIcon from "../../assets/icons/searchingPeople.svg";
import errorAlertIcon from "../../assets/icons/errorAlert.svg";
import "./notFound.css";

const NotFound = () => (
  <div className="page not-found">
    <div class="error">
      <img src={peopleIcon} alt="" />
      <div id="error-text">
        <span>404</span>
        <h1>PAGE INCONNUE !</h1>
        <div className="errorMessage">
          <img src={errorAlertIcon} alt="" />
          Aucun contenu ne correspond à cette adresse
        </div>
      </div>

      <a href="https://labonnealternance.pole-emploi.fr" className="back">
        Retour à l'accueil
      </a>
    </div>
  </div>
);

export default NotFound;
