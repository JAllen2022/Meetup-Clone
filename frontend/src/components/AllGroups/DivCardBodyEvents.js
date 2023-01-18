

export default function DivCardBodyEvents({ event }) {
    console.log('checking my event', event)
    const dateString = new Date(event.startDate).toUTCString();
    return (
      <>
        <div className="div-card-body">
          <div className="div-card-title">
            <h3 className="div-card-title-time">{dateString}</h3>
            <h3 className="div-card-title-name">{event.name}</h3>
          </div>
          <div classname="div-card-info">
                    <p>{event.Group.name} • {event.Group.city}, {event.Group.state}</p>
          </div>
          <div className="div-card-footer">
            <p>{event.numMembers}</p>
          </div>
        </div>
      </>
    );
}
