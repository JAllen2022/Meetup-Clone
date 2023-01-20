import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";

function ProfileButton({ user, state }) {
  const { showMenu, setShowMenu } = state;
  const closeMenu = () => setShowMenu(false);
  const dispatch = useDispatch();
  const history = useHistory();
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
    history.push('/')
  };

  const navigateEvent = () => {
    history.push('/events')
    setShowMenu(false);
  }

  const navigateGroup = () => {
    history.push("/groups");
    setShowMenu(false);

  };

  const ulClassName =
    "profile-button-drop-down-container" + (showMenu ? "" : " hidden");

  return (
    <div>
      <div className="profileIcon" onClick={openMenu}>
        <i className="fas fa-user-circle" />
        <i style={{ color: 212121 }} className="fa-solid fa-caret-down"></i>
      </div>
      <div className={ulClassName}>
        <div ref={ulRef}>
          <div className="profile-button-drop-down-top-half">
            <p className="profile-button-drop-down-elements" onClick={navigateEvent}>Your Events</p>
            <p className="profile-button-drop-down-elements" onClick={navigateGroup}>Your Groups</p>
          </div>
          <div>
            <p className="profile-button-drop-down-elements" onClick={navigateGroup}>View Profile</p>
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
