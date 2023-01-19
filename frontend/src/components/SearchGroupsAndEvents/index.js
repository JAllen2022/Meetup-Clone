import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { thunkGetAllGroups } from "../../store/groups";
import { thunkGetAllEvents } from "../../store/events";
import { useSelector } from "react-redux";
import DivCards from "./DivCards";
import "./SearchGroupsAndEvents.css";

function SearchGroupsAndEvents({ defaultTab }) {
  const [selectedTabGroup, setSelectedTabGroup] = useState(defaultTab==='groups'? true : false);
  const [selectedTabEvent, setSelectedTabEvent] = useState(defaultTab==='events'? true : false);
  const dispatch = useDispatch();
  const groupObj = useSelector((state) => state.groups.allGroups);
  const eventsObj = useSelector((state) => state.events.allEvents);

  let groupArray = [];
  let eventsArray = [];
  if (groupObj) groupArray = Object.values(groupObj);
  if (eventsObj) eventsArray = Object.values(eventsObj);

  const clickedGroup = (e) => {
    if (selectedTabEvent) setSelectedTabEvent(false);
    setSelectedTabGroup(true);
  };

  const clickedEvent = (e) => {
    if (selectedTabGroup) setSelectedTabGroup(false);
    setSelectedTabEvent(true);
  };

  useEffect(() => {
    if (selectedTabGroup && !groupArray.length) {
      dispatch(thunkGetAllGroups());
    } else if (selectedTabGroup && !eventsArray.length) {
      dispatch(thunkGetAllEvents());
    }
  }, [selectedTabEvent, selectedTabGroup, groupObj, eventsObj]);

  return (
    <div className="all-groups-main-outer-body">
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
      {selectedTabGroup
        ? groupArray.map((ele, id) => <DivCards key={id} group={ele} />)
        : eventsArray.map((ele, id) => <DivCards key={id} event={ele} />)}
    </div>
  );
}

export default SearchGroupsAndEvents;
