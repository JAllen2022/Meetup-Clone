import { useState } from "react";
import EventCards from "./EventCards";
import "./Events.css";
import "./GroupPage.css";
import { useSelector } from "react-redux";

function Events({ tab, setTab }) {
  const futureEvents = useSelector((state) => state.groups.groupFutureEvents);
  const pastEvents = useSelector((state) => state.groups.groupPastEvents);

  let displayArray = [];
  if (tab === "upcoming") {
    displayArray =
      futureEvents.length > 0 ? (
        futureEvents.map((ele, index) => <EventCards key={index} event={ele} />)
      ) : (
        <div className="event-card-container no-event"> No events yet!</div>
      );
  } else {
    displayArray =
      pastEvents.length > 0 ? (
        pastEvents.map((ele, index) => <EventCards key={index} event={ele} />)
      ) : (
        <div className="event-card-container no-event"> No past events.</div>
      );
  }
  return (
    <>
      <div className="group-events-main-body-left event-tab-cards-left">
        <div className="group-details-upcoming-container">
          <p
            className={
              tab === "upcoming"
                ? "group-details-selected"
                : "group-details-not-selected "
            }
            onClick={() => setTab("upcoming")}
          >
            Upcoming
          </p>
          <p
            className={
              tab === "past"
                ? "group-details-selected"
                : "group-details-not-selected "
            }
            onClick={() => setTab("past")}
          >
            Past
          </p>
        </div>
      </div>
      <div className="group-events-main-body-right event-tab-cards-right">
        {displayArray}
      </div>
    </>
  );
}

export default Events;
