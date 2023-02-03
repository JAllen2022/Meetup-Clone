import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { thunkGetUserEvents } from "../../store/events";
import "./Events.css";

export default function Events() {
  const userEvents = useSelector((state) => state.events.userEvents);
  const userEventsArray = Object.values(userEvents) || [];
  const dispatch = useDispatch();

  console.log("checking user events:", userEvents);

  useEffect(() => {
    if (userEventsArray.length < 1) dispatch(thunkGetUserEvents());
  }, [dispatch]);

  return (
    <div className="user-group-page-outer-container">
      <div className="user-group-page-left-container">
        <div className="user-group-page-left-return-home-container">
          <div className="left-arrow-container">
            <i class="fa-solid fa-arrow-left"></i>
          </div>
          <Link className="back-to-home-page-text" to="/home">
            {" "}
            Back to home page
          </Link>
        </div>
      </div>
      <div className="user-group-page-right-container">
        <h1>Your Events</h1>
        <div className="user-group-page-group-card-container">

        </div>
      </div>
    </div>
  );
}
