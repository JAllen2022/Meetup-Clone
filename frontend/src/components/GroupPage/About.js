
import EventCards from "./EventCards";
import "./GroupPage.css";

function About({ group, groupEventsArray }) {
  return (
    <>
      {" "}
      <div className="group-details-main-body-left">
        <div className="group-details-main-body-title">
          <h2 className="section-title">What we're about</h2>
          <p className="group-description">{group.about}</p>
        </div>
        <h2>Upcoming Events</h2>
        <div className="group-details-upcoming-events">
          {groupEventsArray.map((ele) => (
            <EventCards event={ele} />
          ))}
        </div>
      </div>
      <div className="group-details-main-body-right">
        <div className="group-details-main-body-right-sticky-menu">
          <div className="group-details-main-body-right-organizer">
            <h2>Organizers</h2>

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
