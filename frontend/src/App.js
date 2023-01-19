import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import HomePage from "./components/HomePage";
import SearchEventAndGroups from "./components/SearchEventAndGroups";
import GroupPage from './components/GroupPage'
import CreateAndUpdateGroup from "./components/CreateAndUpdateGroup";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/groups/:groupId/edit">
            <CreateAndUpdateGroup />
          </Route>
          <Route path="/groups/:groupId">
            <GroupPage />
          </Route>
          <Route path="/create-group">
            <CreateAndUpdateGroup />
          </Route>
          <Route path="/groups">
            <SearchEventAndGroups />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
