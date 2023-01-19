export default function DivCardBodyGroup({group}) {
  return (
    <>
      <div className="div-card-body">
        <div className="div-card-title">
          <h3 className="div-card-title-name">{group.name}</h3>
          <h3 className="div-card-title-location">
            {group.city}, {group.state}
          </h3>
        </div>
        <div classname="div-card-info">
          <p>{group.about}</p>
        </div>
        <div className="div-card-footer">
          <p>
            {group.numMembers} · {group.private ? "Private" : "Public"}
          </p>
        </div>
      </div>
    </>
  );
}
