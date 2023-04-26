import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { resetSingleGroup, thunkGetAllGroups } from "../../store/groups";
import { resetSingleEvent, thunkGetAllEvents } from "../../store/events";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import DivCards from "./DivCards";
import Pagination from "./Pagination";
import "./SearchGroupsAndEvents.css";
import NoResults from "./NoResults";
import { resetSearch } from "../../store/search";
// Call this Search
function SearchGroupsAndEvents({ defaultTab, home }) {
  const [selectedTabGroup, setSelectedTabGroup] = useState(
    defaultTab === "groups" ? true : false
  );
  const [selectedTabEvent, setSelectedTabEvent] = useState(
    defaultTab === "events" ? true : false
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const searchText = useSelector((state) => state.search.searchText);
  const dispatch = useDispatch();
  const history = useHistory();
  const groupObj = useSelector((state) => state.groups.allGroups);
  const eventsObj = useSelector((state) => state.events.allEvents);

  let groupArray = [];
  let eventsArray = [];
  if (groupObj) groupArray = Object.values(groupObj);
  if (eventsObj) eventsArray = Object.values(eventsObj);

  const clickedGroup = (e) => {
    if (selectedTabEvent) {
      setSelectedTabEvent(false);
      if (home) history.push("/groups");
      else history.push("/search/groups");
    }
    setSelectedTabGroup(true);
  };

  const clickedEvent = (e) => {
    if (selectedTabGroup) {
      setSelectedTabGroup(false);
      if (home) history.push("/events");
      else history.push("/search/events");
    }
    setSelectedTabEvent(true);
  };

  // This handles if a user clicks events or groups in the drop down
  // If the selected Group tab is TRUE, and differs from the switch in default Tab, then
  // manually change the tab here
  if (selectedTabGroup && defaultTab === "events") {
    clickedEvent();
  } else if (selectedTabEvent && defaultTab === "groups") {
    clickedGroup();
  }

  useEffect(() => {
    if (
      (defaultTab === "groups" && !groupArray) ||
      (selectedTabGroup && !groupArray.length)
    ) {
      dispatch(thunkGetAllGroups({ name: searchText }));
    } else if (
      defaultTab === "events" // && !eventsArray.length
      // ||
      // (selectedTabGroup && !eventsArray.length)
    ) {
      console.log("we are in here changing pages");
      dispatch(thunkGetAllEvents({ page: currentPage, name: searchText }));
    }
    // dispatch(resetSingleGroup());
    // dispatch(resetSingleEvent());
  }, [selectedTabEvent, selectedTabGroup, currentPage]);

  useEffect(() => {
    return () => dispatch(resetSearch());
  }, []);

  const displayArray = selectedTabGroup
    ? groupArray.map((ele, id) => <DivCards key={id} group={ele} />)
    : eventsArray.map((ele, id) => <DivCards key={id} event={ele} />);

  if (!displayArray.length) {
    if (defaultTab === "groups") {
      displayArray.push(<NoResults tab={"group"} />);
    } else {
      displayArray.push(<NoResults tab={"event"} />);
    }
  }

  return (
    <div className="search-main-outer-body">
      <div className="search-main-inner-body">
        <div className="all-groups-tab-event-group">
          <div
            onClick={clickedGroup}
            className={`all-groups-tab-group ${
              selectedTabGroup ? "selected" : ""
            }`}
          >
            Groups
          </div>
          <div
            onClick={clickedEvent}
            className={`all-groups-tab-group ${
              selectedTabEvent ? "selected" : ""
            }`}
          >
            Events
          </div>
        </div>
        {displayArray}
      </div>
      {/* <Pagination currentPage={currentPage} onPageChange={setCurrentPage} /> */}
    </div>
  );
}

export default SearchGroupsAndEvents;
