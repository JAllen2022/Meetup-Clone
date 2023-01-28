import { useEffect, useState } from "react";
import "./Calendar.css";

export default function Calendar() {
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

  useEffect(() => {
    setFirstDay(new Date(year, month, 1));
    setLastDay(new Date(year, month + 1, 0));
    setPreviousLast(new Date(year, month, 0));
    setMonthString(monthNames[(new Date(year, month + 1, 0).getMonth())]);
    setDisplayYear(new Date(year, month + 1, 0).getFullYear());
  }, [month]);

  console.log("checking date", displayYear);

  const decreaseMonth = () => setMonth(month - 1);
  const increaseMonth = () => setMonth(month + 1);

  let tempArr = [];
  const diffDays = previousLast ? previousLast.getDate() - weekDay : 0;
  if (diffDays) {
    for (let i = 1; i <= weekDay; i++) {
      tempArr.push(<div className="days non-current">{diffDays + i}</div>);
    }
  }
  for (let i = 1; i <= lastDay?.getDate(); i++) {
      tempArr.push(<div className="days">{i}</div>);
  }
  for (let i = 1; i < 7-lastDay?.getDay(); i++) {
    tempArr.push(<div className="days non-current">{i}</div>);
  }


  return (
    <div className="calendar-container">
      <div className="calendar-inner-container">
        <div className="calendar-title-container">
          <span className="calendar-month-text">
            {monthString} {displayYear}
          </span>
          <span
            className="calendar-arrows cal-arr-left"
            onClick={decreaseMonth}
          >
            <i class="fa-solid fa-circle-chevron-left"></i>
          </span>
          <span className="calendar-arrows" onClick={increaseMonth}>
            <i class="fa-solid fa-circle-chevron-right"></i>
          </span>
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
