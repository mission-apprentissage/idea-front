import React from "react";
import { Link } from "react-router-dom";

import routes from "../../routes.json";

import "./jobAdvice.css";

const JobAdvice = (props) => {
  return (
    <section className="advice">
      <Link to={routes.HELPFORUSERPROJECT}>J'ai besoin d'aide pour définir mon projet</Link>
    </section>
  );
};

export default JobAdvice;
