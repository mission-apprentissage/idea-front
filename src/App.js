import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";

import Layout from "./components/Layout";
import { ScrollToTop } from "./components";
import { Landing, JobSelection, DiplomaSelection, HelpForUserProject, Journal, NotFound } from "./pages";

import routes from "./routes.json";

import "./App.css";

const App = () => {
  return (
    <Layout>
      <ScrollToTop />
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path={routes.JOBSELECTION} component={JobSelection} />
        <Route exact path={routes.DIPLOMASELECTION} component={DiplomaSelection} />
        <Route exact path={routes.CHANGELOG} component={Journal} />
        <Route exact path={routes.HELPFORUSERPROJECT} component={HelpForUserProject} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
};

export default withRouter(App);
