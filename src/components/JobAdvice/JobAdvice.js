import React from "react";

import "./jobAdvice.css";

const JobAdvice = (props) => {
  return (
    <section className="advice">
      <a href="http://www.onisep.fr/" target="onisep">
        Tu ne sais pas quel métier exercer ?<br />
        Des pistes pour ton orientation sont disponibles ici
      </a>
    </section>
  );
};

export default JobAdvice;
