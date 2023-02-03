import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import UserPageGroupCard from "./UserPageGroupCard";
import "./UserJoined.css";
import { useEffect } from "react";
import { thunkGetUserGroups } from "../../store/groups";
import { thunkGetUserEvents } from "../../store/events";

export default function UserJoined() {
  const myGroups = useSelector((state) => state.groups.userGroups);
  const myEvents = useSelector((state) => state.events.userEvents);
  const myGroupsArray = Object.values(myGroups).slice(0, 4) || [];
  const myEventsArray = Object.values(myEvents) || [];

  const dispatch = useDispatch();

  useEffect(() => {
    if (myGroupsArray.length < 1) dispatch(thunkGetUserGroups());
    if (myEventsArray.length < 1) dispatch(thunkGetUserEvents());
  }, []);

  return (
    <div className="user-page-left-details">
      <div className="user-page-event-title-container">
        <div>
          <h3>Your next event</h3>
        </div>
        <Link className="user-page-link" to="/events">
          See all your events
        </Link>
      </div>
      <div className="user-page-left-event-card-preview">
        <div className="user-page-left-event-card-title-container">
          <div className="user-page-left-event-card-image">
            <img
              className="user-page-left-event-card-image"
              src="https://secure.meetupstatic.com/next/images/home/Calendar2.svg?w=256"
            ></img>
          </div>
          <div className="user-page-left-event-card-title-text">
            My Event Title
          </div>
        </div>
        <div className="user-page-left-event-card-event-info-container">
          <div>Event Time</div>
          <div>Event Title</div>
          <div>Event Group Name</div>
          <div>Online event</div>
          <div> attending</div>
        </div>
      </div>
      <div className="user-page-event-title-container">
        <div>
          <h3>Your groups</h3>
        </div>
        <Link className="user-page-link" to="/groups">
          See all your groups
        </Link>
      </div>
      <div className="user-page-group-container-cards">
        {myGroupsArray.map((group) => (
          <UserPageGroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}
