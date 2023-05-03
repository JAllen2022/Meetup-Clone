import { useState, useRef, useEffect } from "react";
import "./DetailedProfileCard.css";
import { useSelector } from "react-redux";

function DetailedProfileCard({ member, host, coHost }) {
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((state) => state.session.user);
  const ulRef = useRef();
  const showSelf = member.id === user.id;

  let userOptions = "";

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
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

  console.log("checking host and cohost", host, coHost);
  if (host || coHost) {
    userOptions = (
      <>
        <div
          className="detailed-profile-card-menu-elipses"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          {" "}
          <i class="fa-solid fa-ellipsis"></i>
        </div>
        {showMenu && (
          <div className="detailed-profile-card-menu-container" ref={ulRef}>
            {host && (
              <div className="profile-button-drop-down-elements">
                Make co-host
              </div>
            )}
            <div className="profile-button-drop-down-elements">Make member</div>
            <div className="profile-button-drop-down-elements">
              Remove member
            </div>
          </div>
        )}
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

      <div className="detailed-profile-card-name">
        {member.firstName} {member.lastName}
      </div>
      {userOptions}
    </div>
  );
}

export default DetailedProfileCard;
