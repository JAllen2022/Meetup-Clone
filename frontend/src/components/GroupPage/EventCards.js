import { useHistory } from "react-router-dom";
import formatDateString from "../../util/formatDateString";
import "./GroupPage.css";

function EventCards({ event }) {
  const eventTime = formatDateString(event.startDate);
  const history = useHistory();

  const navigateToEvent = () => {
    history.push(`/events/${event.id}`)
  }

  return (
    <div className="event-card-container" onClick={navigateToEvent}>
      <div>
        <div className="event-card-top-half">
          <div className="event-card-top-half-left">
            <p className="event-card-date-and-time">{eventTime}</p>
            <h3> {event.name}</h3>{" "}
            <i class="fa-solid fa-location-dot fa-solid-profile"></i>
            <span>
              {event.Venue
                ? `${event.Venue.city}, ${event.Venue.state}`
                : "TBD"}
            </span>
            <div>{`${event.numAttending} attendees`}</div>
          </div>
          <div className="event-card-top-half-right">
            <img
              className="event-preview-image"
              src={
                event.previewImage
                  ? event.previewImage
                  : "https://secure.meetupstatic.com/next/images/fallbacks/group-cover-2-wide.webp"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCards;
