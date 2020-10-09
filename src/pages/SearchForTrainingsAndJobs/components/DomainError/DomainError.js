import React, { Component }  from 'react';

import "./DomainError.less";
import domainErrorMainSvg from "../../../../assets/icons/domain_error_main.svg";
import domainErrorNoticeSvg from "../../../../assets/icons/domain_error_notice.svg";



export default function DomainError() {
  return (
    <div className="c-domainerror">
      <div className="c-domainerror-img">
        <img src={domainErrorMainSvg} alt="Ressource non trouvée" />
      </div>
      <div className="c-domainerror-notice">
        <img src={domainErrorNoticeSvg} alt="Erreur technique momentanée" />
      </div>
      <div className="c-domainerror-texttitle">
        Pas de panique !
      </div>
      <div className="c-domainerror-textline1">
        Il y a forcément un résultat qui vous attend,
      </div>
      <div className="c-domainerror-textline2">
        veuillez revenir ultérieurement
      </div>
    </div>
  )  
};
