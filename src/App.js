import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import SearchForm from "./components/search-from/SearchForm";
import Subreddit from "./pages/Subreddit";

function App() {
  return (
    <>
      <header className="header">
        <SearchForm />
      </header>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/r/all" />} />
        <Route path="/r/:subreddit">
          <Subreddit />
        </Route>
        <Route path="*" render={() => <Redirect to="/r/all" />} />
      </Switch>
    </>
  );
}

export default App;
