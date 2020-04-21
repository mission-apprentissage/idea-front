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
  /*TrainingStartTime,
  TrainingLocation,*/
  HelpForUserProject,
  Journal,
  NotFound,
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
        {/*<Route exact path={routes.TRAININGSTARTTIME} component={TrainingStartTime} />
        <Route exact path={routes.TRAININGLOCATION} component={TrainingLocation} />*/}
        <Route exact path={routes.CHANGELOG} component={Journal} />
        <Route exact path={routes.HELPFORUSERPROJECT} component={HelpForUserProject} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
};

export default withRouter(App);
