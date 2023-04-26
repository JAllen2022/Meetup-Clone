import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkGetAllEvents } from "../../store/events";
import DivCards from "../SearchGroupsAndEvents/DivCards";
import "./EventList.css";
import Calendar2 from "../../assets/SVGFiles/Calendar2";

function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export default function EventList({ day, setDay }) {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events.allEvents);
  const [displayArray, setDisplayArray] = useState([]);
  const currentDate = new Date();
  const options = { weekday: "long", month: "long", day: "numeric" };
  const [page, setPage] = useState([0]);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => {
    dispatch(thunkGetAllEvents({ startDate: day, user: true }));
  }, [day]);

  // useEffect(() => {
  //   const loadMore = async () => {
  //     setLoading(true);
  //     const res = await dispatch(
  //       thunkGetAllEvents({ startDate: day, page: page[0] })
  //     );
  //     setLoading(false);
  //   };

  //   const observer = new IntersectionObserver(([entry]) => {
  //     if (entry.isIntersecting && !loading) {
  //       setPage((prevPage) => prevPage + 1);
  //     }
  //   });

  //   if (loaderRef.current) {
  //     observer.observe(loaderRef.current);
  //   }

  //   return () => {
  //     if (loaderRef.current) {
  //       observer.unobserve(loaderRef.current);
  //     }
  //   };
  // }, []);

  // useEffect to account for day changes. This determines what is displayed first
  useEffect(() => {
    const returnArray = [];
    let previousDay = "";
    let dayDateString, firstEvent, eventDate;
    if (day) {
      dayDateString = day.toLocaleDateString("en-US", options);
      if (isSameDay(day, currentDate)) dayDateString = "Today";
    }
    if (events[0]) {
      firstEvent = events[0];
      eventDate = new Date(firstEvent.startDate);
    }
    console.log("checking what day and day string", dayDateString);
    // If we have an event in the first slot in the array, check to see if
    // it is the current day
    if (
      !events.length ||
      (!day && !isSameDay(currentDate, eventDate)) ||
      (!isSameDay(currentDate, eventDate) && day && !isSameDay(day, eventDate))
    ) {
      returnArray.push(
        <>
          <h2 className="user-page-event-day-header">
            {dayDateString ? dayDateString : "Today"}
          </h2>
          <div className="user-page-empty-day-container">
            <Calendar2 />
            <div className="user-page-empty-day-text">
              No matches found for{" "}
              {day
                ? dayDateString
                : currentDate.toLocaleDateString("en-US", options)}
            </div>
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
        <div key={index}>
          {header}
          <DivCards event={event} userAttendingInfo={true} />
        </div>
      );
    });
    returnArray.push(returnArrayEvents);
    setDisplayArray(returnArray);
  }, [events]);

  return (
    <>
      {displayArray}
      <div ref={loaderRef}>{loading && <p>Loading...</p>}</div>
    </>
  );
}
