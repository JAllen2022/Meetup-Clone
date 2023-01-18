import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";

function ProfileButton({ user, state }) {
  const { showMenu, setShowMenu } = state;
  const closeMenu = () => setShowMenu(false);
  const dispatch = useDispatch();
  const ulRef = useRef();

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

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const ulClassName =
    "profile-button-drop-down-container" + (showMenu ? "" : " hidden");

  return (
    <div>
      <div className="profileIcon" onClick={openMenu}>
        <i className="fas fa-user-circle" />
        <i style={{ color: 212121 }} class="fa-solid fa-caret-down"></i>
      </div>
      <div className={ulClassName}>
        <div ref={ulRef}>
          <div className="profile-button-drop-down-top-half">
            <p className="profile-button-drop-down-elements">Your Events</p>
            <p className="profile-button-drop-down-elements">Your Groups</p>
          </div>
          <div>
            <p className="profile-button-drop-down-elements">View Profile</p>
            <p onClick={logout} className="profile-button-drop-down-elements">
              Log Out
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileButton;
