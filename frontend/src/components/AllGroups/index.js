import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllGroups } from "../../store/groups";
import { useSelector } from "react-redux";
import DivCards from './DivCards'
import "./AllGroups.css";

function AllGroups() {
    const [selectedTabGroup, setSelectedTabGroup] = useState(true);
    const [selectedTabEvent, setSelectedTabEvent] = useState(false);
    const dispatch = useDispatch();
    const groupObj = useSelector((state) => state.groups);
    let groupArray = [];
    if(groupObj.Groups) groupArray=Object.values(groupObj.Groups)

  const clickedGroup = (e) => {
    if (selectedTabEvent) setSelectedTabEvent(false);
    setSelectedTabGroup(true);
  };

  const clickedEvent = (e) => {
    if (selectedTabGroup) setSelectedTabGroup(false);
    setSelectedTabEvent(true);
  };

  useEffect(() => {
    if (selectedTabGroup) {
      dispatch(getAllGroups());
    }
  }, [selectedTabEvent, selectedTabGroup]);

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
      {groupArray.map((ele,id)=> <DivCards key={id} group={ele}/>)}
    </div>
  );
}

export default AllGroups;
