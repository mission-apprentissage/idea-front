import React from "react";
import Changelog from "../../components/Changelog";
import { Link } from "react-router-dom";
import content from "../../CHANGELOG";

import "./journal.css";

const Journal = () => {
  return (
    <div className="page journal">
      <p className="home">
        <Link to="/" className="back">
          Retour à l'accueil
        </Link>
      </p>

      <h1 className="mt-3 mb-3">Journal des modifications</h1>
      <Changelog content={content} />
    </div>
  );
};

export default Journal;
