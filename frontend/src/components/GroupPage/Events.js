import { useState } from "react";
import EventCards from "./EventCards";
import "./Events.css";
import "./GroupPage.css";

function Events({ groupEventsArray, tab, setTab }) {
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
        {groupEventsArray.length > 0 ? (
          groupEventsArray.map((ele) => <EventCards event={ele} />)
        ) : (
          <div className="event-card-container no-event"> No events yet!</div>
        )}
      </div>
    </>
  );
}

export default Events;
