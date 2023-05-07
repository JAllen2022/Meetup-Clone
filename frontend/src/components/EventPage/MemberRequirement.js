import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import "./MemberRequirement.css";

export default function FeatureComingSoon({ group }) {
  const history = useHistory();
  const { closeModal } = useModal();
  console.log("checking group", group);
  const directToGroup = () => {
    history.push(`/groups/${group.id}/about`);
    closeModal();
  };

  return (
    <div className="member-requirement-modal">
      <div className="x-marks-the-spot" onClick={() => closeModal()}>
        x
      </div>
      <h1 className="member-requirement-inner-container ">
        You must be a member of the "
        <span onClick={directToGroup} className="member-requirement-modal-span-direct">
          {group.name}
        </span>
        " group to attend.
      </h1>
      {/* <div className="event-body-right-sticky-container"> */}
      <div
        onClick={directToGroup}
        className="event-body-right-group-info-container"
      >
        <div className="event-body-right-group-info-image-container">
          <img
            className="event-body-right-group-info-image"
            src={
              group?.previewImage
                ? group.previewImage
                : "https://secure.meetupstatic.com/next/images/fallbacks/group-cover-2-wide.webp"
            }
          />
        </div>
        <div className="event-body-right-group-info">
          <div className="event-body-right-group-info-title">{group?.name}</div>
          <div className="event-body-righ-group-private-public">
            {group?.private ? "Private Group" : "Public Group"}
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}
