import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { thunkGetUserEvents } from "../../store/events";
import DivCards from "../SearchGroupsAndEvents/DivCards";
import "./Events.css";

export default function Events() {
  const userEvents = useSelector((state) => state.events.userEvents);
  const userEventsArray = Object.values(userEvents) || [];
  const [tab, setTab] = useState("attending");
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
              <i class="fa-solid fa-arrow-left"></i>
            </div>{" "}
            <div className="back-to-home-page-text">Back to home page</div>
          </Link>
          <div className="user-events-tab-container">
            <div
              className={`user-events-tabs ${
                tab === "attending" ? "active" : ""
              }`}
              onClick={() => setTab("attending")}
            >
              {" "}
              Attending{" "}
            </div>
            <div
              className={`user-events-tabs ${
                tab === "hosting" ? "active" : ""
              }`}
              onClick={() => setTab("hosting")}
            >
              {" "}
              Hosting{" "}
            </div>
            <div
              className={`user-events-tabs ${tab === "past" ? "active" : ""}`}
              onClick={() => setTab("past")}
            >
              {" "}
              Past{" "}
            </div>
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
