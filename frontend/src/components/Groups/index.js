import { useSelector } from "react-redux";
import GroupCards from "./GroupCards";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetSingleGroup, thunkGetUserGroups } from "../../store/groups";
import { useEffect } from "react";
import "./Groups.css";

export default function Groups() {
  const myGroups = useSelector((state) => state.groups.userGroups);
  const myGroupsArray = Object.values(myGroups) || [];
  const dispatch = useDispatch();

  useEffect(() => {
    if (myGroupsArray.length < 1) {
      dispatch(thunkGetUserGroups());
    }
    // dispatch(resetSingleGroup);
  }, []);

  console.log("checking group arrays", myGroupsArray);

  return (
    <div className="user-group-page-outer-container">
      <div className="user-group-page-left-container">
        <div className="user-group-page-left-return-home-container">
          <div className="left-arrow-container">
            <i className="fa-solid fa-arrow-left"></i>
          </div>
          <Link className="back-to-home-page-text" to="/home">
            {" "}
            Back to home page
          </Link>
        </div>
      </div>
      <div className="user-group-page-right-container">
        <h1>Your Groups</h1>
        <div className="user-group-page-group-card-container">
          {myGroupsArray.map((group) => (
            <GroupCards key={group.id} group={group} />
          ))}
        </div>
      </div>
    </div>
  );
}
