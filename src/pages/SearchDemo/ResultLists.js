import React from "react";
import { Button } from "reactstrap";
import Training from "./Training";
import PeJob from "./PeJob";
import LbbCompany from "./LbbCompany";

const ResultLists = (props) => {
  const getTrainingResult = () => {
    if (props.hasSearch) {
      return (
        <div className="trainingResult">
          <h2>Formations ({props.trainings.length})</h2>
          {getTrainingList()}
        </div>
      );
    } else {
      return "";
    }
  };

  const getTrainingList = () => {
    if (props.trainings.length) {
      return (
        <>
          {props.trainings.map((training, idx) => {
            return <Training key={idx} training={training} />;
          })}
        </>
      );
    } else return <div className="listText">Aucune formation pour ces critères de recherche</div>;
  };

  const getJobResult = () => {
    if (props.jobs) {
      return (
        <div className="jobResult">
          <h2>
            Postes ({props.jobs.peJobs ? props.jobs.peJobs.length : 0}), Bonnes boîtes (
            {props.jobs.lbbCompanies.companies.length})
          </h2>

          {getPeJobList()}
          {getLbbCompanyList()}
        </div>
      );
    } else {
      return "";
    }
  };

  const getPeJobList = () => {
    if (props.jobs && props.jobs.peJobs && props.jobs.peJobs.length) {
      return (
        <>
          <div className="listText">Postes ouverts en alternance sur Pôle emploi</div>
          {props.jobs.peJobs.map((job, idx) => {
            return <PeJob key={idx} job={job} />;
          })}
        </>
      );
    } else return <div className="listText">Aucun poste pour ces critères de recherche</div>;
  };

  const getLbbCompanyList = () => {
    if (props.jobs && props.jobs.lbbCompanies && props.jobs.lbbCompanies.companies_count) {
      return (
        <>
          <div className="listText">Sociétés recrutant en alternance</div>
          {props.jobs.lbbCompanies.companies.map((company, idx) => {
            return <LbbCompany key={idx} company={company} />;
          })}
        </>
      );
    } else
      return (
        <div className="listText">
          Aucune société susceptible de recruter en alternance pour ces critères de recherche
        </div>
      );
  };

  return (
    <div className={props.isFormVisible ? "hiddenResultList" : ""}>
      <Button onClick={props.showSearchForm}>Filtres</Button>
      {getTrainingResult()}
      {getJobResult()}
    </div>
  );
};

export default ResultLists;
