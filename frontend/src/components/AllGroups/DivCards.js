import defaultImage from "../../assets/DefaultGroupImage.png";
function DivCards({ group }) {
  const directToGroup = () => {
    //direc to group
  };

  return (
    <div onClick={directToGroup} className="div-card">
      <div className="div-card-image">
        {
          <img
            className="div-card-indiv-image"
            src={group.previewImage ? group.previewImage : defaultImage}
            alt="group image"
          />
        }
      </div>
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
    </div>
  );
}

export default DivCards;
