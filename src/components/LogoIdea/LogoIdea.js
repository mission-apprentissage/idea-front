import React from "react";
import logoLBA from "../../assets/logo-noir-lba.svg";

import "./logoidea.css";
import { Row, Col } from "reactstrap";

const LogoIdea = () => {
  const goToLbaHome = () => {
    let p = { type: "goToPage", page: "/" };
    window.parent.postMessage(p, "*");
    //console.log("sentMessageToParent : ",p);
  };

  return (
    <Row className="logoIdea">
      <Col xs="4">
        <a href="#" onClick={goToLbaHome}>
          <img src={logoLBA} alt="Retour page d'accueil de La Bonne Alternance" />
        </a>
      </Col>
      <Col xs="8">
        <h1>Trouvez votre apprentissage</h1>
      </Col>
    </Row>
  );
};

export default LogoIdea;
