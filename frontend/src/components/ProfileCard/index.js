import { useDispatch } from "react-redux";
import "./ProfileCard.css";
import { thunkDeleteAttendance, thunkEditAttendance } from "../../store/events";

function ProfileCard({ member, host, hostBool, eventId }) {
  const isHost = host.id === member.id;
  const dispatch = useDispatch();
  console.log("checking member", member);

  const editAttendance = () => {
    dispatch(
      thunkEditAttendance(eventId, { userId: member.id, status: "attending" })
    );
  };
  const removeAttendance = () => {
    dispatch(thunkDeleteAttendance(eventId, { userId: member.id }));
  };

  return (
    <div className="event-attendees-profile-card">
      <div className="event-attendees-profile-inner-card">
        <div className="event-attendees-profile-image">
          <span>
            <i className="fa-sharp fa-solid fa-circle-user event-profile"></i>
          </span>
        </div>
        <div className="event-attendees-profile-name">
          {member.firstName} {member.lastName}
        </div>
      </div>
      {hostBool && !isHost && (
        <div className="event-attendees-pending">
          {member.Attendance.status !== "attending" && (
            <span className="event-pending-buttons" onClick={editAttendance}>
              <i class="fa-regular fa-circle-check"></i>
            </span>
          )}
          <span className="event-pending-buttons" onClick={removeAttendance}>
            <i class="fa-regular fa-circle-xmark"></i>
          </span>
        </div>
      )}
    </div>
  );
}

export default ProfileCard;
