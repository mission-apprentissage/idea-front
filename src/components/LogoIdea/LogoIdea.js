import React from "react";
import logoLBA from "../../assets/logo-noir-lba.svg";

import "./logoidea.css";
import { Row, Col } from "reactstrap";

const LogoIdea = () => {
  return (
    <Row className="logoIdea">
      <Col xs="4">
        <img src={logoLBA} alt="La Bonne Alternance" />
      </Col>
      <Col xs="8">
        <h1>Trouvez votre formation</h1>
      </Col>
    </Row>
  );
};

export default LogoIdea;
