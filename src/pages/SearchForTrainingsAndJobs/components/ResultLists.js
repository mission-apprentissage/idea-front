import React from "react";
import { Button, Spinner } from "reactstrap";
import Training from "../../../components/ItemDetail/Training";
import PeJob from "../../../components/ItemDetail/PeJob";
import LbbCompany from "../../../components/ItemDetail/LbbCompany";
import { LogoIdea } from "../../../components";
import { useSelector } from "react-redux";
import ExtendedSearchButton from "./ExtendedSearchButton";
import NoJobResult from "./NoJobResult";

const ResultLists = (props) => {
  const { extendedSearch } = useSelector((state) => state.trainings);

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
            return (
              <Training
                key={idx}
                training={training}
                handleSelectItem={props.handleSelectItem}
                searchForJobsCenteredOnTraining={props.searchForJobsCenteredOnTraining}
                isTrainingOnly={props.isTrainingOnly}
              />
            );
          })}
        </>
      );
    } else if (props.isTrainingSearchLoading) {
      return "Nous recherchons les formations, merci de patienter...";
    } else return "";
  };

  const getJobResult = () => {
    const jobCount = getJobCount(props.jobs);

    if (jobCount) {
      if (extendedSearch) {
        const mergedJobList = getMergedJobList();
        return <div className="jobResult">{mergedJobList ? <>{mergedJobList}</> : ""}</div>;
      } else {
        const peJobList = getPeJobList();
        const lbbCompanyList = getLbbCompanyList();
        return (
          <div className="jobResult">
            {peJobList || lbbCompanyList ? (
              <>
                {peJobList}
                {lbbCompanyList}
                {jobCount < 100 ? (
                  <ExtendedSearchButton
                    title="Voir plus de résultats"
                    handleExtendedSearch={props.handleExtendedSearch}
                    isTrainingOnly={props.isTrainingOnly}
                  />
                ) : (
                  ""
                )}
              </>
            ) : (
              <>
                <NoJobResult isTrainingOnly={props.isTrainingOnly} />
                <ExtendedSearchButton
                  title="Etendre la sélection"
                  handleExtendedSearch={props.handleExtendedSearch}
                  isTrainingOnly={props.isTrainingOnly}
                />
              </>
            )}
          </div>
        );
      }
    } else {
      if (extendedSearch) return <NoJobResult isTrainingOnly={props.isTrainingOnly} />;
      else
        return (
          <>
            <NoJobResult isTrainingOnly={props.isTrainingOnly} />
            <ExtendedSearchButton
              title="Etendre la sélection"
              handleExtendedSearch={props.handleExtendedSearch}
              isTrainingOnly={props.isTrainingOnly}
            />
          </>
        );
    }
  };

  const getJobCount = (jobs) => {
    let jobCount = 0;

    if (jobs) {
      if (jobs.peJobs) jobCount += jobs.peJobs.length;

      if (jobs.lbbCompanies) jobCount += jobs.lbbCompanies.companies.length;

      if (jobs.lbaCompanies) jobCount += jobs.lbaCompanies.companies.length;
    }

    return jobCount;
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
    const mergedLbaLbbCompanies = mergeOpportunities("onlyLbbLba");
    if (mergedLbaLbbCompanies.length) {
      return (
        <>
          {mergedLbaLbbCompanies.map((company, idx) => {
            return <LbbCompany key={idx} company={company} handleSelectItem={props.handleSelectItem} />;
          })}
        </>
      );
    } else return "";
  };

  // fusionne les résultats lbb et lba et les trie par ordre croissant de distance, optionnellement intègre aussi les offres PE
  const mergeOpportunities = (onlyLbbLbaCompanies) => {
    let mergedArray = [];
    let resultSources = 0;
    if (props.jobs) {
      if (props.jobs.lbbCompanies && props.jobs.lbbCompanies.companies_count) {
        mergedArray = props.jobs.lbbCompanies.companies;
        resultSources++;
      }

      if (props.jobs.lbaCompanies && props.jobs.lbaCompanies.companies_count) {
        mergedArray = mergedArray.concat(props.jobs.lbaCompanies.companies);
        resultSources++;
      }

      if (!onlyLbbLbaCompanies && props.jobs.peJobs && props.jobs.peJobs.length > 0) {
        mergedArray = mergedArray.concat(props.jobs.peJobs);
        resultSources++;
      }

      if (resultSources > 1)
        mergedArray.sort((a, b) => {
          let distanceA, distanceB;
          if (a.type === "peJob") distanceA = a.lieuTravail.distance;
          else distanceA = a.distance;

          if (b.type === "peJob") distanceB = b.lieuTravail.distance;
          else distanceB = b.distance;

          if (distanceA > distanceB) return 1;
          if (distanceA < distanceB) return -1;
          return 0;
        });
    }

    return mergedArray;
  };

  // retourne le bloc construit des items lbb, lba et pe triés par ordre de distance
  const getMergedJobList = () => {
    const mergedOpportunities = mergeOpportunities();

    if (mergedOpportunities.length) {
      return (
        <>
          {mergedOpportunities.map((opportunity, idx) => {
            if (opportunity.type === "peJob")
              return <PeJob key={idx} job={opportunity} handleSelectItem={props.handleSelectItem} />;
            else return <LbbCompany key={idx} company={opportunity} handleSelectItem={props.handleSelectItem} />;
          })}
        </>
      );
    } else return "";
  };

  // construit le bloc formaté avec les décomptes de formations et d'opportunités d'emploi
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

    if (!props.isTrainingOnly) {
      if (props.isJobSearchLoading) {
        jobPart = (
          <div className="searchLoading">
            Recherche des entreprises en cours
            <Spinner />
          </div>
        );
      } else {
        let jobs = getJobCount(props.jobs),
          jobCount,
          jobCountLabel = " entreprise ne correspond";

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
