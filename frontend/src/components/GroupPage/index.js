import { useParams, NavLink, useHistory } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  thunkGetSingleGroup,
  thunkGetGroupEvents,
  thunkGetMemberships,
  thunkAddMembership,
  resetSingleGroup,
  thunkDeleteMembership,
} from "../../store/groups";
import { useSelector, useDispatch } from "react-redux";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteModal from "../DeleteModal";
import About from "./About";
import Events from "./Events";
import Members from "./Members";
import Photos from "./Photos";
import "./GroupPage.css";

const groupNavBar = [
  {
    name: "About",
    to: "/about",
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

function GroupPage({ tab }) {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const group = useSelector((state) => state.groups.singleGroup);
  const user = useSelector((state) => state.session.user);
  const [eventTab, setEventTab] = useState("upcoming");
  const [showMenu, setShowMenu] = useState(false);
  const closeMenu = () => setShowMenu(false);
  const ulRef = useRef();

  const memberships = useSelector(
    (state) => state.groups.singleGroupMemberships
  );
  const groupEvents = useSelector((state) => state.groups.groupFutureEvents);
  const groupPastEvents = useSelector((state) => state.groups.groupPastEvents);

  let groupEventsArray = Object.values(groupEvents);
  let groupPastEventsArray = Object.values(groupPastEvents);

  const userMem = memberships[user.id];

  let buttonName = "";
  let statusPending = false;
  let showOptions = "";

  const deleteMembershipFunc = () => {
    dispatch(thunkDeleteMembership(groupId, user.id));
    setShowMenu(false);
  };

  const createEvent = () => {
    history.push(`/groups/${groupId}/create-event`);
  };

  const editGroup = () => {
    history.push(`/groups/${groupId}/edit`);
  };

  const optionsMember = (
    <>
      <div className="group-drop-menu-options" onClick={deleteMembershipFunc}>
        {" "}
        {statusPending ? "Cancel group invitation" : "Leave this group"}
      </div>
    </>
  );

  const optionsCoHost = (
    <>
      <div className="group-drop-menu-options" onClick={createEvent}>
        Create Event
      </div>
      <div className="group-drop-menu-options" onClick={editGroup}>
        Edit Group
      </div>
      <div className="group-drop-menu-options" onClick={deleteMembershipFunc}>
        {" "}
        Leave this group
      </div>
    </>
  );

  const optionsHost = (
    <>
      <div className="group-drop-menu-options" onClick={createEvent}>
        Create Event
      </div>
      <div className="group-drop-menu-options" onClick={editGroup}>
        Edit Group
      </div>
      <OpenModalMenuItem
        itemText={<div className="group-drop-menu-options">Delete Group</div>}
        onItemClick={closeMenu}
        modalComponent={<DeleteModal groupId={group.id} type={"Group"} />}
      />
    </>
  );

  if (userMem) {
    if (userMem.Membership.status == "host") {
      buttonName = "You're the host";
      showOptions = optionsHost;
    } else if (userMem.Membership.status == "co-host") {
      buttonName = "You're a co-host";
      showOptions = optionsCoHost;
    } else if (userMem.Membership.status === "pending") {
      buttonName = "Status pending";
      statusPending = true;
      showOptions = optionsMember;
    } else {
      buttonName = "You're a member";
      showOptions = optionsMember;
    }
  }

  let displayBody = [];

  if (tab === "about") {
    displayBody = (
      <About
        group={group}
        groupEventsArray={groupEventsArray}
        groupPastEvents={groupPastEventsArray}
      />
    );
  } else if (tab === "events") {
    displayBody = (
      <Events
        group={group}
        tab={eventTab}
        setTab={setEventTab}
        groupEventsArray={groupEventsArray}
      />
    );
  } else if (tab === "members") {
    displayBody = <Members group={group} memberships={memberships} />;
  } else {
    displayBody = <Photos group={group} />;
  }

  let groupImage = {};
  if (group.GroupImages)
    groupImage = group.GroupImages.find((ele) => ele.preview === true);

  useEffect(() => {
    dispatch(thunkGetSingleGroup(groupId));
    console.log("we are here");
    dispatch(thunkGetMemberships(groupId));
    dispatch(thunkGetGroupEvents(groupId));
    return () => {
      dispatch(resetSingleGroup());
    };
  }, [dispatch]);

  // useEffect(() => {
  // }, [eventTab]);

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
      <div className="group-details-entire-doc-body-inner">
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
                  {
                    Object?.values(memberships)?.filter(
                      (ele) => ele?.Membership?.status !== "pending"
                    )?.length
                  }{" "}
                  · {group.private ? "Private group" : "Public group"}
                </span>
              </div>
              <div>
                <i className="fa-solid fa-user fa-solid-profile"></i>
                <span className="group-details-header-spans">
                  Organized By{" "}
                  <span className="group-details-header-span-group-org">
                    {group.Organizer?.firstName} {group.Organizer?.lastName}
                  </span>
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
                  <span>{ele.name}</span>
                </NavLink>
              ))}
            </div>
            <div className="group-details-nav-bar-dropdown" ref={ulRef}>
              {userMem ? (
                <>
                  <button
                    className="group-detail-nav-bar-button"
                    onClick={() => setShowMenu((prev) => !prev)}
                  >
                    <div className="group-detail-nav-bar-inner-button-div">
                      <span>{buttonName}</span>
                      <i className="fa-solid fa-angle-down"></i>
                    </div>
                  </button>
                  {showMenu && (
                    <div className="group-detail-nav-bar-dropdown-container">
                      <div className="group-detail-nav-bar-dropdown-container-items">
                        {showOptions}
                      </div>
                    </div>
                  )}{" "}
                </>
              ) : (
                <div
                  className="group-page-user-join-button"
                  onClick={() => dispatch(thunkAddMembership(groupId))}
                >
                  {" "}
                  Join this group
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="group-details-body-container">
          <div className="group-details-main-body-wrapper">{displayBody}</div>
        </div>
      </div>
    </div>
  );
}

export default GroupPage;
