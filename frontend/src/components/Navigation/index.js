// frontend/src/components/Navigation/index.js
import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { resetSingleGroup } from "../../store/groups";
import { resetSingleEvent } from "../../store/events";
import ProfileButton from "./ProfileButton";
import imageLogo from "../../assets/LinkUpLogo.png";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import WorldIcon from "../../assets/SVGFiles/WorldIcon";
import SearchBar from "./SearchBar";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const [showMenu, setShowMenu] = useState(false);
  const closeMenu = () => setShowMenu(false);
  const dispatch = useDispatch();

  const refreshGroup = () => {
    dispatch(resetSingleGroup());
  };

  return (
    <div className={`nav-bar ${sessionUser ? "nav-active" : ""}`}>
      <div className="nav-bar-inner">
        <div className="nav-bar-logo-left">
          {sessionUser ? (
            <>
              <NavLink exact to="/home" className="nav-bar-logo-container">
                <img
                  id="nav-bar-logo-image"
                  src={imageLogo}
                  alt="link up logo"
                />
              </NavLink>
              <SearchBar />
            </>
          ) : (
            <NavLink exact to="/" className="nav-bar-logo-container">
              <img id="nav-bar-logo-image" src={imageLogo} alt="link up logo" />
            </NavLink>
          )}
        </div>
        {isLoaded && (
          <div
            className={
              sessionUser ? "nav-bar-user-right-login" : "nav-bar-user-right"
            }
          >
            {sessionUser ? (
              <>
                <div className="nav-bar-create-group">
                  <Link
                    id="create-group"
                    to="/create-group"
                    onClick={refreshGroup}
                  >
                    Start a new group - 30% off!
                  </Link>
                </div>
                <ProfileButton
                  user={sessionUser}
                  state={{ showMenu, setShowMenu }}
                />
              </>
            ) : (
              <>
                <div>
                  <div className="english-icon">
                    <WorldIcon /> <span className="english-text">English</span>
                  </div>
                </div>
                <OpenModalMenuItem
                  itemText={<div className="log-in"> Log in</div>}
                  onItemClick={closeMenu}
                  modalComponent={<LoginFormModal />}
                />
                <OpenModalMenuItem
                  itemText={<div className="sign-up"> Sign up</div>}
                  onItemClick={closeMenu}
                  modalComponent={<SignupFormModal />}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Navigation;
