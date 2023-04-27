import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./Calendar.css";

export default function Calendar({ day, setDay }) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Setting data format for calendar
  const date = new Date();
  const year = date.getFullYear();
  const [month, setMonth] = useState(date.getMonth());
  const [monthString, setMonthString] = useState();
  const [firstDay, setFirstDay] = useState();
  const [lastDay, setLastDay] = useState();
  const [displayYear, setDisplayYear] = useState(date.getFullYear());
  const [previousLast, setPreviousLast] = useState();
  // const [startWeekDay, setStartWeekDay] = useState();
  const weekDay = firstDay?.getDay();
  const history = useHistory();

  useEffect(() => {
    setFirstDay(new Date(year, month, 1));
    setLastDay(new Date(year, month + 1, 0));
    setPreviousLast(new Date(year, month, 0));
    setMonthString(monthNames[new Date(year, month + 1, 0).getMonth()]);
    setDisplayYear(new Date(year, month + 1, 0).getFullYear());
  }, [month]);

  const decreaseMonth = () => setMonth(month - 1);
  const increaseMonth = () => setMonth(month + 1);

  let tempArr = [];
  const diffDays = previousLast ? previousLast.getDate() - weekDay : 0;
  if (diffDays) {
    for (let i = 1; i <= weekDay; i++) {
      tempArr.push(
        <div key={`first-${i}`} className="days non-current">
          {diffDays + i}
        </div>
      );
    }
  }
  for (let i = 1; i <= lastDay?.getDate(); i++) {
    // Check to see if the day is the current day, if so, we style it to highlight the day the user selected
    if (
      day &&
      month === day.getMonth() &&
      displayYear === day.getFullYear() &&
      i === day.getDate()
    ) {
      tempArr.push(
        <div
          key={`${i}`}
          onClick={() => setDay(date)}
          className="days current active"
        >
          {i}
        </div>
      );
      // Check to see if it is today, special styling for today's date
    } else if (
      month === date.getMonth() &&
      displayYear === date.getFullYear() &&
      i === date.getDate()
    ) {
      tempArr.push(
        <div
          key={`${i}`}
          onClick={() => setDay(date)}
          className="days current today"
        >
          {i}
        </div>
      );
      // Else, standard styling
    } else
      tempArr.push(
        <div
          key={`${i}`}
          onClick={() =>
            day < date
              ? history.push("/events/past")
              : setDay(new Date(displayYear, month, i))
          }
          className="days current"
        >
          {i}
        </div>
      );
  }
  for (let i = 1; i < 7 - lastDay?.getDay(); i++) {
    tempArr.push(
      <div key={`last-${i}`} className="days non-current">
        {i}
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <div className="calendar-inner-container">
        <div className="calendar-title-container">
          <div className="calendar-month-text">
            {monthString} {displayYear}
          </div>
          <div className="calendar-arrows-container">
            <i
              onClick={decreaseMonth}
              className="fa-solid fa-circle-chevron-left calendar-arrows"
            ></i>
            <i
              onClick={increaseMonth}
              className="fa-solid fa-circle-chevron-right calendar-arrows"
            ></i>
          </div>
        </div>
        <div className="calendar-day-container">
          <div className="weekdays">Su</div>
          <div className="weekdays">Mo</div>
          <div className="weekdays">Tu</div>
          <div className="weekdays">We</div>
          <div className="weekdays">Th</div>
          <div className="weekdays">Fr</div>
          <div className="weekdays">Sa</div>
          {tempArr}
        </div>
        <div className="calendar"></div>
      </div>
    </div>
  );
}
