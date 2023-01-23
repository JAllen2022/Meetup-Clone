import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import FeatureComingSoon from "../FeatureComingSoon";
import OpenModalMenuItem from "./OpenModalMenuItem";

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
        <i className="fas fa-user-circle prof-icon-nav" />
        <i className="fa-solid fa-caret-down"></i>
      </div>
      <div className={ulClassName}>
        <div ref={ulRef}>
          <div className="profile-button-drop-down-top-half">
            <p
              className="profile-button-drop-down-elements"
              onClick={navigateEvent}
            >
              Events
            </p>
            <p
              className="profile-button-drop-down-elements"
              onClick={navigateGroup}
            >
              Groups
            </p>
          </div>
          <div className="profile-button-drop-down-top-half">
            <OpenModalMenuItem
              itemText={
                <p
                  onButtonClick={closeMenu}
                  className="profile-button-drop-down-elements"
                >
                  Your Events
                </p>
              }
              modalComponent={<FeatureComingSoon />}
            />
            <OpenModalMenuItem
              itemText={
                <p
                  onButtonClick={closeMenu}
                  className="profile-button-drop-down-elements"
                >
                  Your Groups
                </p>
              }
              modalComponent={<FeatureComingSoon />}
            />
          </div>
          <div>
            <OpenModalMenuItem
              itemText={
                <p
                  onButtonClick={closeMenu}
                  className="profile-button-drop-down-elements"
                >
                  View Profile
                </p>
              }
              modalComponent={<FeatureComingSoon />}
            />
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
