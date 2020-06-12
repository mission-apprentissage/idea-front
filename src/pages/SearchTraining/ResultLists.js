import React from "react";
import { Button } from "reactstrap";
import Training from "./Training";
import PeJob from "./PeJob";
import LbbCompany from "./LbbCompany";
import { LogoIdea } from "../../components";

const ResultLists = (props) => {
  const getTrainingResult = () => {
    if (props.hasSearch) {
      return <div className="trainingResult">{getTrainingList()}</div>;
    } else {
      return "";
    }
  };

  const getTrainingList = () => {
    if (props.trainings.length) {
      return (
        <>
          {props.trainings.map((training, idx) => {
            return <Training key={idx} training={training} handleSelectItem={props.handleSelectItem} />;
          })}
        </>
      );
    } else return <div className="listText">Aucune formation pour ces critères de recherche</div>;
  };

  const getJobResult = () => {
    if (props.jobs) {
      return (
        <div className="jobResult">
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
          {props.jobs.peJobs.map((job, idx) => {
            return <PeJob key={idx} job={job} handleSelectItem={props.handleSelectItem} />;
          })}
        </>
      );
    } else return <div className="listText">Aucun poste pour ces critères de recherche</div>;
  };

  const getLbbCompanyList = () => {
    if (props.jobs && props.jobs.lbbCompanies && props.jobs.lbbCompanies.companies_count) {
      return (
        <>
          {props.jobs.lbbCompanies.companies.map((company, idx) => {
            return <LbbCompany key={idx} company={company} handleSelectItem={props.handleSelectItem} />;
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

  const getResultCounts = () => {
    const trs = props.trainings ? props.trainings.length : "";
    let jobs = 0;

    if (props.jobs) {
      if (props.jobs.peJobs) jobs += props.jobs.peJobs.length;
      if (props.jobs.lbbCompanies && props.jobs.lbbCompanies.companies) jobs += props.jobs.lbbCompanies.companies.length;
    }

    let trainingCount = trs,
      trainingCountLabel = " formation ne correspond",
      jobCount = jobs,
      jobCountLabel = " entreprise ne correspond";

    if (trs == 0) {
      trainingCount = "Aucune";
    } else if (trs == 1) {
      trainingCountLabel = " formation correspond";
    } else {
      trainingCountLabel = " formations correspondent";
    }

    if (jobs == 0) {
      jobCount = "Aucune";
    } else if (jobs === 1) {
      jobCountLabel = " entreprise correspond";
    } else {
      jobCountLabel = " entreprises correspondent";
    }

    return (
      <div className="resultTitle">
        <span className="countValue">{trainingCount}</span>
        {trainingCountLabel} à votre recherche
        <br />
        <span className="countValue">{jobCount}</span>
        {jobCountLabel} à votre recherche
      </div>
    );
  };

  return (
    <div className={props.isFormVisible || props.selectedItem ? "hiddenResultList" : ""}>
      <header>
        <LogoIdea />
        <Button className="blueButton filterButton" onClick={props.showSearchForm}>
          <span className="hiddenSM"> Filtres</span>
        </Button>
      </header>
      <div className="clearBoth" />
      {getResultCounts()}
      {getTrainingResult()}
      {getJobResult()}
    </div>
  );
};

export default ResultLists;
