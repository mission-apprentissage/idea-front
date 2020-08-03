import React from "react";

const NoJobResult = ({ isTrainingOnly }) => {
  return isTrainingOnly ? (
    ""
  ) : (
    <div className="bold jobColor noOpportunityFound">Aucune opportunité de stage trouvée</div>
  );
};

export default NoJobResult;
