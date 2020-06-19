import React from "react";
import { Button, Spinner } from "reactstrap";
import Training from "../../components/ItemDetail/Training";
import PeJob from "../../components/ItemDetail/PeJob";
import LbbCompany from "../../components/ItemDetail/LbbCompany";
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
          {props.searchRadius < props.trainings[0].sort[0] ? (
            <div className="trainingColor bold">
              Aucune formation ne correspondait à votre zone de recherche, nous avons trouvé les plus proches
            </div>
          ) : (
            ""
          )}
          {props.trainings.map((training, idx) => {
            return <Training key={idx} training={training} handleSelectItem={props.handleSelectItem} />;
          })}
        </>
      );
    } else if (props.isTrainingSearchLoading) {
      return "Nous recherchons les formations, merci de patienter...";
    } else return "";
  };

  const getJobResult = () => {
    if (props.jobs) {
      const peJobList = getPeJobList();
      const lbbCompanyList = getLbbCompanyList();
      return (
        <div className="jobResult">
          {peJobList || lbbCompanyList ? (
            <>
              {peJobList}
              {lbbCompanyList}
            </>
          ) : (
            ""
          )}
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
      //} else return <div className="listText">Aucun poste pour ces critères de recherche</div>;
    } else return "";
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
    } else return "";
  };

  const getResultCounts = () => {
    let trainingPart = "";

    if (props.isTrainingSearchLoading) {
      trainingPart = (
        <div className="searchLoading">
          Recherche des formations en cours
          <Spinner />
        </div>
      );
    } else {
      const trs = props.trainings ? props.trainings.length : "";
      let trainingCount = trs,
        trainingCountLabel = " formation ne correspond";

      if (trs === 0) {
        trainingCount = "Aucune";
      } else if (trs === 1) {
        trainingCountLabel = " formation trouvée";
      } else {
        trainingCountLabel = " formations trouvées";
      }

      trainingPart = (
        <>
          <span className="countValue">{trainingCount}</span>
          {trainingCountLabel}
        </>
      );
    }

    let jobPart = "";

    if (props.isJobSearchLoading) {
      jobPart = (
        <div className="searchLoading">
          Recherche des entreprises en cours
          <Spinner />
        </div>
      );
    } else {
      let jobs = 0,
        jobCount,
        jobCountLabel = " entreprise ne correspond";

      if (props.jobs) {
        if (props.jobs.peJobs) jobs += props.jobs.peJobs.length;
        if (props.jobs.lbbCompanies && props.jobs.lbbCompanies.companies)
          jobs += props.jobs.lbbCompanies.companies.length;
      }

      jobCount = jobs;

      if (jobs === 0) {
        jobCount = "Aucune";
      } else if (jobs === 1) {
        jobCountLabel = " entreprise trouvée";
      } else {
        jobCountLabel = " entreprises trouvées";
      }
      jobPart = (
        <>
          <span className="countValue">{jobCount}</span>
          {jobCountLabel}
        </>
      );
    }
    return (
      <div className="resultTitle">
        <span className="trainingColor">{trainingPart}</span>
        <br />
        <span className="jobColor">{jobPart}</span>
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
