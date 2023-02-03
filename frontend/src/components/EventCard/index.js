import formatDateString from "../../util/formatDateString";
import "./EventCard.css";

export default function EventCard({ event, userAttendingInfo }) {
  const dateString = formatDateString(event.startDate);
  // if (!event) return null;
  let divFiller = "";

  if (userAttendingInfo) {
    divFiller = (
      <>
        <div className="div-card-event-information">
          {event.Group?.name}
        </div>
        <div className="div-card-event-footer">
          <p>{event.numAttending} attendees</p>
        </div>
      </>
    );
  } else {
    divFiller = (
      <>
        <div className="div-card-event-information">
          {event.Group?.name} • {event.Group?.city}, {event.Group?.state}
        </div>
        <div className="div-card-event-footer">
          <p>{event.numAttending} attendees</p>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="div-card-event-body">
        <div className="div-card-event-title">
          <h4 className="div-card-event-title-time">{dateString}</h4>
          <h3 className="div-card-event-title-name">{event?.name}</h3>
        </div>

        {divFiller}
      </div>
    </>
  );
}
