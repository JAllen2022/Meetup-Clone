import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import HomePage from "./components/HomePage";
import SearchGroupsAndEvents from "./components/SearchGroupsAndEvents";
import GroupPage from './components/GroupPage'
import CreateAndUpdateGroup from "./components/CreateAndUpdateGroup";
import CreateAndUpdateEvent from './components/CreateAndUpdateEvent'
import EventPage from './components/EventPage';
import Events from './components/Events'
import UserPage from "./components/UserPage";
import Footer from "./components/Footer";
import Groups from "./components/Groups";

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
          <Route exact path="/groups">
            <Groups />
          </Route>
          <Route exact path="/events">
            <Events />
          </Route>
          <Route path="/groups/:groupId/create-event">
            <CreateAndUpdateEvent />
          </Route>
          <Route path="/groups/:groupId/photos">
            <GroupPage tab={"photos"} />
          </Route>
          <Route path="/groups/:groupId/members">
            <GroupPage tab={"members"} />
          </Route>
          <Route path="/groups/:groupId/events">
            <GroupPage tab={"events"} />
          </Route>
          <Route path="/groups/:groupId/edit">
            <CreateAndUpdateGroup />
          </Route>
          <Route path="/groups/:groupId/about">
            <GroupPage tab={"about"} />
          </Route>
          <Route path="/create-group">
            <CreateAndUpdateGroup />
          </Route>
          <Route path="/events/:eventId/edit">
            <CreateAndUpdateEvent />
          </Route>
          <Route path="/events/:eventId">
            <EventPage />
          </Route>
          <Route path="/search/groups">
            <SearchGroupsAndEvents defaultTab={"groups"} />
          </Route>
          <Route path="/search/events">
            <SearchGroupsAndEvents defaultTab={"events"} />
          </Route>
          <Route path='/home'>
            <UserPage />
          </Route>
        </Switch>
      )}
      <Footer />
    </>
  );
}

export default App;
