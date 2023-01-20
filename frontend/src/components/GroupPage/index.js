import { useParams, NavLink, useHistory } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { thunkGetSingleGroup, thunkGetGroupEvents } from "../../store/groups";
import { useSelector, useDispatch } from "react-redux";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteModal from "../DeleteModal";
import EventCards from "./EventCards";
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
  const history = useHistory();
  const group = useSelector((state) => state.groups.singleGroup);
  const groupEvents = useSelector((state) => state.groups.groupEvents);
  const user = useSelector((state) => state.session.user);
  const [showMenu, setShowMenu] = useState(false);
  const closeMenu = () => setShowMenu(false);

  const optionsMember = (
    <div className="profile-button-drop-down-top-half">
      <p className="profile-button-drop-down-elements">Leave Group</p>
    </div>
  );

  const optionsGuest = (
    <div className="profile-button-drop-down-top-half">
      <p className="profile-button-drop-down-elements">Request Membership</p>
    </div>
  );

  const createEvent = () => {
    history.push(`/groups/${groupId}/create-event`)
  };

  const editGroup = () => {
    history.push(`/groups/${groupId}/edit`);
  };


  const optionsHost = (
    <div className="profile-button-drop-down-top-half group-drop-menu">
      <p className="profile-button-drop-down-elements" onClick={createEvent}>
        Create Event
      </p>
      <p className="profile-button-drop-down-elements" onClick={editGroup}>
        Edit Group
      </p>
      <OpenModalMenuItem
        itemText={<p
          className="profile-button-drop-down-elements"
        >
          Delete Group
        </p>}
        onItemClick={closeMenu}
        modalComponent={<DeleteModal groupId={group.id} type={"Group"} />}
      />
    </div>
  );
  const [userType, setUserType] = useState(optionsGuest);
  const ulRef = useRef();

  let groupImage = {};
  let groupEventsArray = Object.values(groupEvents);
  if (group.GroupImages)
    groupImage = group.GroupImages.find((ele) => ele.preview === true);

  // Three options for Group Actions button
  // If you are the owner, you can edit and delete the group
  // If you are a logged in user - you can request membership
  // if you are not logged in - do not show the button
  useEffect(() => {
    if (user && group.Organizer) {
      if (user.id === group.Organizer.id) {
        setUserType(optionsHost);
      } else {
        setUserType(optionsMember);
      }
    }
  }, [user, group]);

  useEffect(() => {
    dispatch(thunkGetSingleGroup(groupId));
    dispatch(thunkGetGroupEvents(groupId));
  }, [dispatch]);

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current) {
        if (!ulRef.current.contains(e.target)) {
          setShowMenu(false);
        }
      } else {
        return () => document.removeEventListener("click", closeMenu);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  return (
    <div className="group-details-entire-doc-body">
      <div className="group-details-header-outer">
        <div className="group-details-header">
          <div className="group-details-header-image-container">
            <img
              id="group-details-header-image"
              src={
                groupImage?.url
                  ? groupImage.url
                  : "https://secure.meetupstatic.com/next/images/fallbacks/group-cover-2-wide.webp"
              }
              alt="group image"
            />
          </div>
          <div className="group-details-header-title-body">
            <h1>{group.name}</h1>
            <div>
              <i className="fa-solid fa-location-dot fa-solid-profile"></i>
              <span className="group-details-header-spans">
                {group.city}, {group.state}
              </span>
            </div>
            <div>
              <i className="fa-solid fa-user-group fa-solid-profile"></i>
              <span className="group-details-header-spans">
                {group.numMembers} ·{" "}
                {group.private ? "Private group" : "Public group"}
              </span>
            </div>
            <div>
              <i className="fa-solid fa-user fa-solid-profile"></i>
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
          <div className="group-details-nav-bar-buttons-container"></div>
          <div className="group-details-nav-bar-buttons">
            {groupNavBar.map((ele) => (
              <NavLink
                exact
                className="group-page-navLinks"
                key={ele.name}
                to={`/groups/${groupId}${ele.to}`}
              >
                <span>{ele.name}</span>
              </NavLink>
            ))}
          </div>
          <div className="group-details-nav-bar-dropdown" ref={ulRef}>
            <button
              className="group-detail-nav-bar-button"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              <div className="group-detail-nav-bar-inner-button-div">
                <span>Group Actions</span>
                <i class="fa-solid fa-angle-down"></i>
              </div>
            </button>
            {showMenu && (
              <div className="group-detail-nav-bar-dropdown-container">
                <div className="group-detail-nav-bar-dropdown-container-items">
                  {userType}
                </div>
              </div>
            )}
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
            <h2>Upcoming Events</h2>
            <div className="group-details-upcoming-events">
              {groupEventsArray.map((ele) => (
                <EventCards event={ele} />
              ))}
            </div>
          </div>
          <div className="group-details-main-body-right">
            <div className="group-details-main-body-right-sticky-menu">
              <div className="group-details-main-body-right-organizer">
                <h2>Organizers</h2>

                <p>
                  <i className="fa-solid fa-user fa-solid-profile"></i>
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
