import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Calendar from "./Calendar";
import UserJoined from "./UserJoined";
import EventList from "./EventList.js";
import "./UserPage.css";

export default function UserPage() {
  const user = useSelector((state) => state.session.user);

  return (
    <div className="user-page-container">
      <div className="user-page-body-container">
        <div className="user-page-header-container">
          <h1 id="user-page-title">Welcome, {user.firstName} 👋</h1>
          <h3 id="user-page-sub-title"> Events from your groups </h3>
        </div>
        <div className="user-page-content-body-container">
          <div className="user-page-content-body-container-left">
            <Calendar />
            <UserJoined />
          </div>
          <div className="user-page-content-body-container-right">
            <EventList />
          </div>
        </div>
      </div>
    </div>
  );
}
