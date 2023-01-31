import { Link } from "react-router-dom";
import "./UserJoined.css";

export default function UserJoined() {
  return (
    <div className="user-page-left-details">
      <div className="user-page-event-title-container">
        <div>
          <h3>Your next event</h3>
        </div>
        <Link className="user-page-link">See all your events</Link>
      </div>
      <div className="user-page-left-event-card-preview">
        <div className="user-page-left-event-card-title-container">
          <div className="user-page-left-event-card-image">
            <img
              id="user-page-left-event-card-image"
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
        <Link className="user-page-link">See all your groups</Link>
      </div>
      <div className="user-page-group-container-cards">
        <div className="user-page-group-card">
          <div className="user-page-left-event-card-image">
            <img
              id="user-page-left-event-card-image"
              src="https://secure.meetupstatic.com/next/images/home/Calendar2.svg?w=256"
            ></img>
          </div>
          <div className="user-page-left-event-card-title-text">
            My Group Title
          </div>
        </div>
      </div>
    </div>
  );
}
