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
import "./Navigation.css";
import SearchBar from "./SearchBar";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const [showMenu, setShowMenu] = useState(false);
  const closeMenu = () => setShowMenu(false);
  const dispatch = useDispatch();

  const refreshGroup = () => {
    dispatch(resetSingleGroup());
  };

  return (
    <div className="nav-bar">
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
            <NavLink exact to="/">
              <img id="nav-bar-logo-image" src={imageLogo} alt="link up logo" />
            </NavLink>
          )}
        </div>
        {isLoaded && (
          <div className="nav-bar-user-right">
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
                <OpenModalMenuItem
                  itemText={<p className="log-in"> Log in</p>}
                  onItemClick={closeMenu}
                  modalComponent={<LoginFormModal />}
                />
                <OpenModalMenuItem
                  itemText={<p className="log-in"> Sign up</p>}
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
