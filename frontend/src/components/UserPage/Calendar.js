import "./Calendar.css";

export default function Calendar() {
    let tempArr=[]
    for (let i = 1; i < 31; i++){
        tempArr.push(<div className="days">{i}</div>);
    }
  return (
    <div className="calendar-container">
      <div className="calendar-inner-container">
        <div className="calendar-title-container">
          <span className="calendar-month-text">Month Year</span>
          <span className="calendar-arrows cal-arr-left">
            <i class="fa-solid fa-circle-chevron-left"></i>
          </span>
          <span className="calendar-arrows">
            <i class="fa-solid fa-circle-chevron-right"></i>
          </span>
        </div>
        <div className="calendar-day-container">
          <div className="days">Su</div>
          <div className="days">Mo</div>
          <div className="days">Tu</div>
          <div className="days">We</div>
          <div className="days">Th</div>
          <div className="days">Fr</div>
          <div className="days">Sa</div>
          {tempArr}
        </div>
        <div className="calendar"></div>
      </div>
    </div>
  );
}
