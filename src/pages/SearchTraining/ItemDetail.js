import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCross } from "@fortawesome/free-solid-svg-icons";
import { LogoIdea } from "../../components";
import { Button } from "reactstrap";

const ItemDetail = (props) => {

    console.log("open selectedItem ",props.selectedItem);

    return  <div className={`itemDetail ${props.selectedItem ? "" : "hiddenItemDetail"}`}>
    <header>
      <LogoIdea />
      <Button className="closeButton" onClick={props.handleClose}><FontAwesomeIcon icon={faCross} /></Button>
    </header>
    <div className="clearBoth" />
    Le détail sélectionné
  </div>
}

export default ItemDetail;
