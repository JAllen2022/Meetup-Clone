import  formatDateString  from "../../util/formatDateString";

export default function DivCardBodyEvents({ event }) {
  const dateString = formatDateString(event.startDate);
  return (
    <>
      <div className="div-card-body">
        <div className="div-card-title">
          <h4 className="div-card-title-time">{dateString}</h4>
          <h3 className="div-card-title-name">{event.name}</h3>
        </div>
        <div classname="div-card-info">
          <p>
            {event.Group.name} • {event.Group.city}, {event.Group.state}
          </p>
        </div>
        <div className="div-card-footer">
          <p>{event.numMembers}</p>
        </div>
      </div>
    </>
  );
}
