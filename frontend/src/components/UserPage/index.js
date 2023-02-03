import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkGetAllEvents } from "../../store/events";
import DivCards from "../SearchGroupsAndEvents/DivCards";
import Calendar from "./Calendar";
import UserJoined from "./UserJoined";
import "./UserPage.css";

export default function UserPage() {
  const user = useSelector((state) => state.session.user);
  const events = useSelector((state) => state.events.allEvents);
  const eventArray = Object.values(events) || [];
  const dispatch = useDispatch();

  console.log("checking my event array", eventArray);

  useEffect(() => {
    if (eventArray.length < 1) dispatch(thunkGetAllEvents());
  }, [dispatch]);

  return (
    <div className="user-page-container">
      <div className="user-page-body-container">
        <div className="user-page-header-container">
          <h1>Welcome, {user.firstName} 👋</h1>
          <h3> Events from your groups </h3>
        </div>
        <div className="user-page-content-body-container">
          <div className="user-page-content-body-container-left">
            <Calendar />
            <UserJoined />
          </div>
          <div className="user-page-content-body-container-right">
            <h2>Upcoming Events</h2>
            {eventArray.map((event, index) => (
              <DivCards key={index} event={event} userAttendingInfo={true} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
