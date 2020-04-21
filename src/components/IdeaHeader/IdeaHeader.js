import React from "react";
import IdeaTitle from "../IdeaTitle";
import "./ideaHeader.css";

const IdeaHeader = () => {
  return (
    <header>
      <IdeaTitle />
      <p>
        Trouve la formation et l'entreprise
        <br />
        pour réaliser ton projet !
      </p>
    </header>
  );
};

export default IdeaHeader;
