import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { LogoIdea } from "../../components";
import { Button } from "reactstrap";
import LbbCompany from "./LbbCompany";
import Training from "./Training";
import PeJob from "./PeJob";

const ItemDetail = ({ selectedItem, handleClose }) => {
  console.log("open selectedItem ", selectedItem);

  return (
    <div className={`itemDetail ${selectedItem ? "" : "hiddenItemDetail"}`}>
      <header>
        <Button className="closeButton" onClick={handleClose}>
          <FontAwesomeIcon icon={faTimes} />
        </Button>
        {selectedItem && selectedItem.type === "pe" ? <PeJob job={selectedItem.item} showTextOnly={true} /> : ""}
        {selectedItem && selectedItem.type === "lbb" ? (
          <LbbCompany company={selectedItem.item} showTextOnly={true} />
        ) : (
          ""
        )}
        {selectedItem && selectedItem.type === "training" ? (
          <Training training={selectedItem.item} showTextOnly={true} />
        ) : (
          ""
        )}
      </header>
      <div className="clearBoth" />
      Le détail sélectionné
    </div>
  );
};

export default ItemDetail;
