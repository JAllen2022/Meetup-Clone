import { Link, useHistory } from "react-router-dom";
import defaultImage from "../../assets/DefaultGroupImage.png";
import DivCardBodyGroup from "./DivCardBodyGroup";
import EventCard from "../EventCard";

function DivCards({ event, group, userAttendingInfo }) {
  const history = useHistory();
  let previewImage;
  if (event) previewImage = event.previewImage;
  else previewImage = group.previewImage;

  const directToGroup = () => {
    if (group) {
      let directTo = `/groups/${group.id}/about`;
      history.push(directTo);
    } else {
      let directTo = `/events/${event.id}`;
      history.push(directTo);
    }
  };

  return (
    <div onClick={directToGroup} className="div-card">
      <div className="div-card-image">
        {
          <img
            className="div-card-indiv-image"
            src={
              previewImage
                ? previewImage
                : "https://secure.meetupstatic.com/next/images/fallbacks/group-cover-2-wide.webp"
            }
            alt="group image"
          />
        }
      </div>
      {group ? (
        <DivCardBodyGroup group={group} />
      ) : (
        <EventCard event={event} userAttendingInfo={userAttendingInfo} />
      )}
    </div>
  );
}

export default DivCards;
