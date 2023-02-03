import formatDateString from "../../util/formatDateString";
import "./EventCard.css";

export default function DivCardBodyEvents({ event }) {
  const dateString = formatDateString(event.startDate);
  // if (!event) return null;
  return (
    <>
      <div className="div-card-event-body">
        <div className="div-card-event-title">
          <h4 className="div-card-event-title-time">{dateString}</h4>
          <h3 className="div-card-event-title-name">{event?.name}</h3>
        </div>
        <div className="div-card-event-information">
          {event.Group?.name} • {event.Group?.city}, {event.Group?.state}
        </div>
        <div className="div-card-event-footer">
          <p>{event.numAttending} attendees</p>
        </div>
      </div>
    </>
  );
}
