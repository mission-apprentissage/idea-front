import React, { Component }  from 'react';

import "./DomainError.css";
import domainErrorMainSvg from "../../../../assets/icons/domain_error_main.svg";
import domainErrorNoticeSvg from "../../../../assets/icons/domain_error_notice.svg";



export default function DomainError() {
  return (
    <div class="c-domainerror">
      <div class="c-domainerror-img">
        <img src={domainErrorMainSvg} alt="" />
      </div>
      <div class="c-domainerror-notice">
        <img src={domainErrorNoticeSvg} alt="" />
      </div>
      <div class="c-domainerror-texttitle">
        Pas de panique !
      </div>
      <div class="c-domainerror-textline1">
        Il y a forcément un résultat qui vous attend,
      </div>
      <div class="c-domainerror-textline2">
        veuillez revenir ultérieurement
      </div>
    </div>
  )  
};
