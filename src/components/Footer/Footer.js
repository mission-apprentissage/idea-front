import React from "react";
import { Link } from "react-router-dom";

import routes from "../../routes.json";

import "./footer.css";

const Footer = () => {
  return (
    <footer className="footerNav">
      <section className="advice">
        <Link to={routes.HELPFORUSERPROJECT}>J'ai besoin d'aide pour définir mon projet</Link>
      </section>
      <section>
        <h5>Support</h5>
        <a href="mailto:Anne-Camille.MONET@pole-emploi.fr">anne-camille.monet@pole-emploi.fr</a>
      </section>
      <section>
        <h5>Journal</h5>
        <Link to={routes.CHANGELOG}>Journal des évolutions</Link>
      </section>
      <section className="copyright">Copyright © 2020</section>
    </footer>
  );
};

export default Footer;
