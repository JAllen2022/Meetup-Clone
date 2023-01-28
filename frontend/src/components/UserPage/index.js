import { useSelector } from "react-redux";
import Calendar from "./Calendar";
import UserJoined from './UserJoined'
import "./UserPage.css";

export default function UserPage() {
  const user = useSelector((state) => state.session.user);

  return (
    <div className="user-page-container">
      <div className="user-page-body-container">
        <div className="user-page-header-container">
          <h1>Welcome, {user.firstName} 👋</h1>
          <h3> Events from your groups </h3>
        </div>
        <div className="user-page-content-body-container">
          <div className="user-page-content-body-container-left">
            <Calendar />
            <UserJoined />
          </div>
          <div className="user-page-content-body-container-right">Today</div>
        </div>
      </div>
    </div>
  );
}
