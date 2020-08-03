import React from "react";
import { Button } from "reactstrap";

const ExtendedSearchButton = ({ title }) => {
  const handleClick = () => {
    console.log("yeah");
  };

  return (
    <Button className="submitButton" onClick={handleClick}>
      {title}
    </Button>
  );
};

export default ExtendedSearchButton;
