import React from "react";
import { Link } from "react-router-dom";

import routes from "../../routes.json";

import "./footer.css";

const Footer = (props) => {
  return (
    <footer className="footerNav">
      {/*<section>
        <h5>Journal</h5>
        <Link to={routes.CHANGELOG}>Journal des évolutions</Link>
      </section>*/}
      <section className="copyright">Copyright © 2020</section>
    </footer>
  );
};

export default Footer;
