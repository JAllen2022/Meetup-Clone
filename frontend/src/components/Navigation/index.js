// frontend/src/components/Navigation/index.js
import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import imageLogo from '../../assets/LinkUpLogo.png'
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className='nav-bar'>
      <div className="nav-bar-logo-left">
          <NavLink exact to="/">
            <img id='nav-bar-logo-image' src={imageLogo} alt='link up logo' />
          </NavLink>
        </div>
      {isLoaded && (
        <div className='nav-bar-user-right'>
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </div>
  );
}

export default Navigation;
