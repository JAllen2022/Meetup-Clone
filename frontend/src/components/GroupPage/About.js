import EventCards from "./EventCards";
import "./GroupPage.css";

function About({ group, groupEventsArray, groupPastEvents }) {
  return (
    <>
      {" "}
      <div className="group-details-main-body-left">
        <div className="group-details-main-body-title">
          <h2 className="section-title">What we're about</h2>
          <p className="group-description">{group.about}</p>
        </div>
        <h2 className="section-title">
          Upcoming Events ({groupEventsArray.length})
        </h2>
        <div className="group-details-upcoming-events">
          {groupEventsArray.length > 0 ? (
            groupEventsArray.map((ele) => <EventCards event={ele} />)
          ) : (
            <div className="event-card-container no-event">
              {" "}
              No upcoming events yet!
            </div>
          )}
        </div>
        <h2 className="section-title">
          Past Events ({groupPastEvents.length})
        </h2>
        <div className="group-details-upcoming-events">
          {groupPastEvents.length > 0 ? (
            groupPastEvents.map((ele) => <EventCards event={ele} />)
          ) : (
            <div className="event-card-container no-event">
              {" "}
              No past events yet!
            </div>
          )}
        </div>
      </div>
      <div className="group-details-main-body-right">
        <div className="group-details-main-body-right-sticky-menu">
          <div className="group-details-main-body-right-organizer">
            <h2 className="section-title">Organizers</h2>

            <p>
              <i className="fa-solid fa-user fa-solid-profile"></i>
              {group.Organizer?.firstName} {group.Organizer?.lastName}
            </p>
          </div>
          <div className="group-detail-main-body-right-members">{}</div>
        </div>
      </div>
    </>
  );
}

export default About;
