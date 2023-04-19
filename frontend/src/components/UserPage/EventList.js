import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkGetAllEvents } from "../../store/events";
import DivCards from "../SearchGroupsAndEvents/DivCards";
import "./EventList.css";
import Calendar2 from "../../assets/SVGFiles/Calendar2";

export default function EventList() {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events.allEvents);
  const currentDate = new Date();
  const options = { weekday: "long", month: "long", day: "numeric" };

  useEffect(() => {
    dispatch(thunkGetAllEvents());
  }, [dispatch]);

  let previousDay = "";
  const returnArray = [];
  if (events[0]) {
    const firstEvent = events[0];
    const eventDate = new Date(firstEvent.startDate);
    console.log("we are in here bruh");
    if (
      currentDate.getFullYear() !== eventDate.getFullYear() ||
      currentDate.getDate() !== eventDate.getDate() ||
      currentDate.getMonth() !== eventDate.getMonth()
    ) {
      console.log("we are in here bruh 2");

      returnArray.push(
        <>
          <h2 className="user-page-event-day-header">Today</h2>
          <div className="user-page-empty-day-container">
            <Calendar2 />
            <div classname="user-page-empty-day-text">
              No matches found for{" "}
              {currentDate.toLocaleDateString("en-US", options)}
            </div>
          </div>
        </>
      );
    }
  } else if (events.length < 1) {
    returnArray.push(
      <>
        <h2 className="user-page-event-day-header">Today</h2>
        <div className="user-page-empty-day-container">
          <Calendar2 />
          <span classname="user-page-empty-day-text">
            No matches found for{" "}
            {currentDate.toLocaleDateString("en-US", options)}
          </span>
        </div>
      </>
    );
  }
  const returnArrayEvents = events.map((event, index) => {
    const eventDate = new Date(event.startDate);
    let header = "";
    // If we have the same date, set header to Today
    if (
      currentDate.getFullYear() === eventDate.getFullYear() &&
      currentDate.getDate() === eventDate.getDate() &&
      currentDate.getMonth() === eventDate.getMonth() &&
      eventDate.getDate() !== previousDay
    ) {
      header = <h2 className="user-page-event-day-header">Today</h2>;
      previousDay = eventDate.getDate();
    } else if (eventDate.getDate() !== previousDay) {
      previousDay = eventDate.getDate();
      header = (
        <h2 className="user-page-event-day-header">
          {eventDate.toLocaleDateString("en-US", options)}
        </h2>
      );
    }
    return (
      <>
        {header}
        <DivCards key={index} event={event} userAttendingInfo={true} />
      </>
    );
  });

  returnArray.push(returnArrayEvents);

  return <>{returnArray}</>;
}
