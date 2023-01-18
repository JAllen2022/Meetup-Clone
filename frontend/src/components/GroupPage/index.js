import { useParams, NavLink } from "react-router-dom";
import { useEffect } from "react";
import { getSingleGroup, getGroupEvents } from "../../store/groups";
import { useSelector, useDispatch } from "react-redux";
import "./GroupPage.css";

const groupNavBar = [
  {
    name: "About",
    to: "",
  },
  {
    name: "Events",
    to: "/events",
  },
  {
    name: "Members",
    to: "/members",
  },
  {
    name: "Photos",
    to: "/photos",
  },
];

function GroupPage() {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const group = useSelector((state) => state.groups.singleGroup);
  const groupEvents = useSelector((state) => state.groups.singleGroupEvents);
  // console.log('checking groupId', typeof groupId)
  // console.log("checking my groupevents", groupEvents);

  let groupImage = {};
  if (group.GroupImages)
    groupImage = group.GroupImages.find((ele) => ele.preview === true);

  function memberOptions() {}

  useEffect(() => {
    dispatch(getSingleGroup(groupId));
    dispatch(getGroupEvents(groupId));
  }, [dispatch]);

  return (
    <div className="group-details-entire-doc-body">
      <div className="group-details-header-outer">
        <div className="group-details-header">
          <div className="group-details-header-image-container">
            <img
              id="group-details-header-image"
              src={groupImage?.url ? groupImage.url : ""}
              alt="group image"
            />
          </div>
          <div className="group-details-header-title-body">
            <h1>{group.name}</h1>
            <div>
              <i class="fa-solid fa-location-dot"></i>
              <span className="group-details-header-spans">
                {group.city}, {group.state}
              </span>
            </div>
            <div>
              <i class="fa-solid fa-user-group"></i>
              <span className="group-details-header-spans">
                {group.numMembers} ·{" "}
                {group.private ? "Private group" : "Public group"}
              </span>
            </div>
            <div>
              <i class="fa-solid fa-user"></i>
              <span className="group-details-header-spans">
                Organized By {group.Organizer?.firstName}{" "}
                {group.Organizer?.lastName}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="group-details-nav-bar-container">
        <div className="group-details-nav-bar">
          <div className="group-details-nav-bar-buttons">
            {groupNavBar.map((ele) => (
              <NavLink
                exact
                className="group-page-navLinks"
                key={ele.name}
                to={`/groups/${groupId}${ele.to}`}
              >
                {ele.name}
              </NavLink>
            ))}
          </div>
          <div className="group-details-nav-bar-dropdown">
            <button
              className="group-detail-nav-bar-button"
              onClick={memberOptions}
            >
              <span>You're a member</span>{" "}
              <i class="fa-solid fa-angle-down"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="group-details-body-container">
        <div className="group-details-main-body-wrapper">
          <div className="group-details-main-body-left">
            <div className="group-details-main-body-title">
              <h2 className="section-title">What we're about</h2>
              <p className="group-description">{group.about}</p>
            </div>
            <div className="group-details-upcoming-events">
              <h2>Upcoming Events</h2>
              {/* <EventCards /> */}
            </div>
          </div>
          <div className="group-details-main-body-right">
            <div className="group-details-main-body-right-sticky-menu">
              <div className="group-details-main-body-right-organizer">
                <h2>Organizers</h2>
                <p>
                  {group.Organizer?.firstName} {group.Organizer?.lastName}
                </p>
              </div>
              <div className="group-detail-main-body-right-members">{}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupPage;
