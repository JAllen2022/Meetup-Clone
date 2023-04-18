import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { thunkGetUserGroups } from "../../store/groups";
import { thunkGetUserEvents } from "../../store/events";
import formatDateString from "../../util/formatDateString";
import UserPageGroupCard from "./UserPageGroupCard";
import "./UserJoined.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function UserJoined() {
  const myGroups = useSelector((state) => state.groups.userGroups);
  const myEvents = useSelector((state) => state.events.userEvents);
  const history = useHistory();
  const myGroupsArray = Object.values(myGroups).slice(0, 4) || [];
  const myEventsArray = Object.values(myEvents) || [];

  const dispatch = useDispatch();

  const eventRedirect = () => {
    history.push();
  };

  useEffect(() => {
    if (!myGroupsArray.length) dispatch(thunkGetUserGroups());
    if (!myEventsArray.length) dispatch(thunkGetUserEvents());
  }, []);

  let featuredEvent = (
    <div className="user-page-left-event-card-preview">
      <div className="user-page-left-event-card-title-container1">
        <div className="user-page-left-event-card-image">
          <img
            className="user-page-left-event-card-image"
            src="https://secure.meetupstatic.com/next/images/home/Calendar2.svg?w=256"
          ></img>
        </div>
        <div className="user-page-left-event-card-title-text">
          No events yet!
        </div>
      </div>
    </div>
  );
  if (myEventsArray.length) {
    const event = myEventsArray[0];

    const startDate = formatDateString(event.startDate);
    const eventLocation =
      event.type === "In person"
        ? event.Venue
          ? event.Venue.city + ", " + event.Venue.state
          : "TBD"
        : "Online";

    featuredEvent = (
      <div
        className="user-page-left-event-card-preview"
        onClick={() => history.push(`/events/${event.id}`)}
      >
        <div className="user-page-left-event-card-title-container2">
          <div className="user-page-left-event-card-image">
            <img
              className="user-page-left-event-card-image"
              src={
                event.previewImage
                  ? event.previewImage
                  : "https://secure.meetupstatic.com/next/images/home/Calendar2.svg?w=256"
              }
            ></img>
          </div>
          <div className="user-page-left-event-card-title-text">
            {event.Group.name}
          </div>
        </div>
        <div className="user-page-left-event-card-event-info-container">
          <div className="user-page-div-card-event-title-time">{startDate}</div>
          <div className="user-page-div-card-event-name">{event.name}</div>
          <div className="user-page-div-card-event-information">
            {event.Group.name}
          </div>
          <div className="user-page-div-card-event-location">
            <i className="fa-solid fa-location-dot fa-solid-event user-page-div-card-icon"></i>{" "}
            {eventLocation}
          </div>
          <div className="user-page-div-card-attending-div">
            <i class="fa-solid fa-circle-check user-page-div-card-attending-icon"></i>
            Attending
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page-left-details">
      <div className="user-page-event-title-container">
        <div>
          <h2 className="user-page-joined-title">Your next event</h2>
        </div>
        <Link className="user-page-link" to="/events">
          See all your events
        </Link>
      </div>
      {featuredEvent}
      <div className="user-page-event-title-container">
        <div>
          <h2 className="user-page-joined-title">Your groups</h2>
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
