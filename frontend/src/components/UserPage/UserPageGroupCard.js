import { useHistory } from "react-router-dom";
import "./UserPageGroupCard.css";

export default function UserPageGroupCard({ group }) {
  const history = useHistory();
  return (
    <div
      className="user-page-group-card"
      onClick={() => history.push(`/groups/${group.id}/about`)}
    >
      <div className="user-page-left-event-card-image-container">
        <img
          className="user-page-left-group-card-image"
          src={
            group.previewImage
              ? group.previewImage
              : "https://secure.meetupstatic.com/next/images/home/Calendar2.svg?w=256"
          }
        ></img>
      </div>
      <div className="user-page-left-event-card-title-text">{group.name}</div>
    </div>
  );
}
