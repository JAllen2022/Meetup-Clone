import ProfileCard from '../ProfileCard'
import "./GroupPage.css";
import "./Members.css"

function Members({ memberships }) {
  const memberArray = Object.values(memberships);

  return (
    <div className="group-details-members-tab-container">
      {memberArray.map((ele) => <ProfileCard key={ele.id} member={ele} />)}
    </div>
  );
}

export default Members;
