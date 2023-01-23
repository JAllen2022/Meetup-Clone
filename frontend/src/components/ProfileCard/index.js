import './ProfileCard.css'

function ProfileCard({ member }) {
  console.log('checking member here', member)
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
      </div>
    );
}

export default ProfileCard;
