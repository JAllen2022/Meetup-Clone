import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { thunkGetUserEvents } from "../../store/events";
import DivCards from "../SearchGroupsAndEvents/DivCards";
import "./Events.css";

export default function Events({ importTab }) {
  const userEvents = useSelector((state) => state.events.userEvents);
  const userEventsArray = Object.values(userEvents) || [];
  const [tab, setTab] = useState(importTab || "attending");
  const dispatch = useDispatch();

  console.log("checking user events:", userEventsArray);

  useEffect(() => {
    dispatch(thunkGetUserEvents({ tab }));
  }, [tab]);

  return (
    <div className="user-page-container">
      <div className="user-group-page-outer-container">
        <div className="user-group-page-left-container">
          <Link
            className="user-group-page-left-return-home-container"
            to="/home"
          >
            <div className="left-arrow-container">
              <i className="fa-solid fa-arrow-left"></i>
            </div>{" "}
            <div className="back-to-home-page-text">Back to home page</div>
          </Link>
          <div className="user-events-tab-container">
            <Link
              className={`user-events-tabs ${
                tab === "attending" ? "active" : ""
              }`}
              onClick={() => setTab("attending")}
              to="/events/attending"
            >
              {" "}
              Attending{" "}
            </Link>
            <Link
              className={`user-events-tabs ${
                tab === "hosting" ? "active" : ""
              }`}
              onClick={() => setTab("hosting")}
              to="/events/hosting"
            >
              {" "}
              Hosting{" "}
            </Link>
            <Link
              className={`user-events-tabs ${tab === "past" ? "active" : ""}`}
              onClick={() => setTab("past")}
              to="/events/past"
            >
              {" "}
              Past{" "}
            </Link>
          </div>
        </div>
        <div className="user-group-page-right-container">
          <h1>Your Events</h1>
          <div className="user-event-page-group-card-container">
            {userEventsArray.map((event, index) => (
              <DivCards key={index} event={event} userAttendingInfo={true} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
