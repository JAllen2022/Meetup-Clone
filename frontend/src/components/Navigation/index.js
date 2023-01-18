// frontend/src/components/Navigation/index.js
import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import ProfileButton from "./ProfileButton";
import imageLogo from "../../assets/LinkUpLogo.png";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const [showMenu, setShowMenu] = useState(false);
  const closeMenu = () => setShowMenu(false);

  return (
    <div className="nav-bar">
      <div className="nav-bar-logo-left">
        <NavLink exact to="/">
          <img id="nav-bar-logo-image" src={imageLogo} alt="link up logo" />
        </NavLink>
      </div>
      {isLoaded && (
        <div className="nav-bar-user-right">
          {sessionUser ? (
            <ProfileButton
              user={sessionUser}
              state={{ showMenu, setShowMenu }}
            />
          ) : (
            <>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Navigation;
