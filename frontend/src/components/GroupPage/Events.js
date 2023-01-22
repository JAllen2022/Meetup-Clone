import EventCards from './EventCards';
import './Events.css'
import './GroupPage.css'

function Events({ groupEventsArray }) {
  return (
    <>
      <div className="group-events-main-body-left event-tab-cards-left">
        <div className="group-details-upcoming-container">
          <p className="group-details-upcoming">Event</p>
        </div>
      </div>
      <div className="group-events-main-body-right event-tab-cards-right">
        {groupEventsArray.length > 0 ? (
          groupEventsArray.map((ele) => <EventCards event={ele} />)
        ) : (
          <div className='event-card-container no-event'> No events yet!</div>
        )}
      </div>
    </>
  );
}

export default Events;
