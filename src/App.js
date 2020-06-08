import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";

import Layout from "./components/Layout";
import { ScrollToTop } from "./components";
import {
  Landing,
  JobSelection,
  HasDiplomaSelection,
  DiplomaSelection,
  TrainingDurationSelection,
  StartTimeSelection,
  LocationSelection,
  HelpForUserProject,
  Journal,
  NotFound,
  TrainingList,
  ApiTester,
  SearchTraining,
} from "./pages";

import routes from "./routes.json";

import "./App.css";

const App = () => {
  return (
    <Layout>
      <ScrollToTop />
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path={routes.JOBSELECTION} component={JobSelection} />
        <Route exact path={routes.HASDIPLOMASELECTION} component={HasDiplomaSelection} />
        <Route exact path={routes.DIPLOMASELECTION} component={DiplomaSelection} />
        <Route exact path={routes.TRAININGDURATIONSELECTION} component={TrainingDurationSelection} />
        <Route exact path={routes.STARTTIMESELECTION} component={StartTimeSelection} />
        <Route exact path={routes.LOCATIONSELECTION} component={LocationSelection} />
        <Route exact path={routes.TRAININGLIST} component={TrainingList} />
        <Route path={routes.TRAININGLIST + "/:rank"} component={TrainingList} />
        <Route exact path={routes.CHANGELOG} component={Journal} />
        <Route exact path={routes.APITESTER} component={ApiTester} />
        <Route exact path={routes.SEARCHTRAINING} component={SearchTraining} />
        <Route exact path={routes.HELPFORUSERPROJECT} component={HelpForUserProject} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
};

export default withRouter(App);
