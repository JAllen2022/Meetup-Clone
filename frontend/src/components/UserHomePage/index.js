import { useSelector } from "react-redux";
import SearchGroupsAndEvents from "../SearchGroupsAndEvents";
import "./UserHomePage.css";

function UserHomepage({ defaultTab }) {
  const user = useSelector((state) => state.session.user);
  return (
    <div className="user-header-container-outer">
      <div className="user-header-container-inner">
        <h1>Welcome, {user.firstName} 👋</h1>
        <h3>
          {defaultTab === "groups" ? "Recommended groups" : "Recommended events"}
        </h3>
      </div>
      <SearchGroupsAndEvents defaultTab={defaultTab} home={'home'} />
    </div>
  );
}
export default UserHomepage;
