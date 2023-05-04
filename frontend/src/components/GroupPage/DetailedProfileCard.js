import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "./DetailedProfileCard.css";
import { thunkDeleteMembership, thunkEditMembership } from "../../store/groups";

function DetailedProfileCard({ member, host, coHost, leadership }) {
  const { groupId } = useParams();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((state) => state.session.user);
  const ulRef = useRef();
  const dispatch = useDispatch();
  const showSelf = member.id === user.id;

  let userOptions = "";
  const displayDateString = `Joined ${new Date(
    member.createdAt
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  // Dispatch make co-host
  const makeCoHost = () => {
    const data = { memberId: member.id, status: "co-host" };
    dispatch(thunkEditMembership(groupId, data));
    setShowMenu(false);
  };

  const makeMember = () => {
    const data = { memberId: member.id, status: "member" };
    dispatch(thunkEditMembership(groupId, data));
    setShowMenu(false);
  };

  const removeMember = () => {
    dispatch(thunkDeleteMembership(groupId, member.id));
    setShowMenu(false);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  if (member.id !== user.id && (host || coHost)) {
    userOptions = (
      <>
        <div
          className="detailed-profile-card-menu-elipses"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          {" "}
          <i class="fa-solid fa-ellipsis"></i>
        </div>
        <div ref={ulRef}>
          {showMenu && (
            <div className="detailed-profile-card-menu-container">
              {host && member.Membership.status !== "co-host" && (
                <div
                  className="profile-button-drop-down-elements"
                  onClick={makeCoHost}
                >
                  Make co-host
                </div>
              )}
              {member.Membership.status !== "member" && (
                <div
                  className="profile-button-drop-down-elements"
                  onClick={makeMember}
                >
                  Make member
                </div>
              )}
              <div
                className="profile-button-drop-down-elements"
                onClick={removeMember}
              >
                Remove member
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
  return (
    <div className="detailed-profile-card">
      <div className="detailed-profile-card-image">
        <span>
          <i className="fa-sharp fa-solid fa-circle-user event-profile"></i>
        </span>
      </div>
      <div className="detailed-profile-info">
        <div className="detailed-profile-card-name">
          {member.firstName} {member.lastName}
        </div>
        {leadership && (
          <div className="detailed-profile-card-joined">
            {member.Membership.status === "host"
              ? "Organizer"
              : "Assistant organizer"}
          </div>
        )}
        <div className="detailed-profile-card-joined">{displayDateString}</div>
      </div>
      {userOptions}
    </div>
  );
}

export default DetailedProfileCard;
