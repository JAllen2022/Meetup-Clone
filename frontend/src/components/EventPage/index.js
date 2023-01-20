import { useParams, useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { thunkGetSingleEvent } from "../../store/events";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteModal from "../DeleteModal";
import formatDateString from "../../util/formatDateString.js";
import ProfileCard from "../ProfileCard";
import "./EventPage.css";

function EventPage() {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const ulRef = useRef();
  const event = useSelector((state) => state.events.singleEvent);
  const user = useSelector((state) => state.session.user);
  // console.log("checking my eventimages", event.EventImages);
  const [eventImage, setEventImage] = useState();
  const [showMenu, setShowMenu] = useState(false);
  const groupInfo = event.Group;
  const venueInfo = event.Venue;
  const closeMenu = () => setShowMenu(false)
  // console.log('checking event0', event)
  let venueCity = "";
  let venueState = "";
  let startTimeString = "";
  let endTimeString = "";
  if (event.startDate) startTimeString = formatDateString(event.startDate);
  if (event.endDate) endTimeString = formatDateString(event.endDate);
  if (event.Venue) {
    venueCity = event.Venue.city;
    venueState = event.Venue.state;
  }
  const eventLocation =
    event.type === "In person"
      ? venueCity
        ? venueCity + ", " + venueState
        : "TBD"
      : "Online";

  // Helper functions here for group options button
  const optionsMember = (
    <div className="">
      <p className=""></p>
    </div>
  );

  const optionsGuest = (
    <div className="">
      <p className=""></p>
    </div>
  );

  const createEvent = () => {};

  const editGroup = () => {
    history.push(``);
  };

  const deleteGroup = () => {
    dispatch("");
  };

  const optionsHost = (
    <div className="">
      <p className="" onClick={createEvent}>
        Create Event
      </p>
      <p className="" onClick={editGroup}>
        Edit Group
      </p>
      <p className="" onClick={deleteGroup}>
        Delete Group
      </p>
    </div>
  );

  const [userType, setUserType] = useState(optionsGuest);
  const directToGroup = () => history.push(`/groups/${groupInfo.id}/about`);

  // Three options for Group Actions button
  // If you are the owner, you can edit and delete the group
  // If you are a logged in user - you can request membership
  // if you are not logged in - do not show the button
  useEffect(() => {
    // if (user && group.Organizer) {
    //   if (user.id === event.Organizer.id) {
    //     setUserType(optionsHost);
    //   } else {
    //     setUserType(optionsMember);
    //   }
    // }
  }, [user, event]);

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

  useEffect(() => {
    setEventImage(
      event.EventImages
        ? event.EventImages.find((ele) => ele.preview === true)
        : null
    );
  }, [event]);

  useEffect(() => {
    dispatch(thunkGetSingleEvent(eventId));
  }, [dispatch]);
  if (!event) return null;

  return (
    <div className="event-page-container">
      <div className="event-page-header-container">
        <div className="event-page-header-item-wrapper">
          <h1 className="event-page-title">{event.name}</h1>
          <div className="event-page-title-host-container">
            <i class="fa-regular fa-circle-user full-rounded-profile"></i>
            <div className="hosts-container">
              <div>Hosted by</div>
              <div>Somebody</div>
            </div>
          </div>
        </div>
      </div>
      <div className="event-body-container">
        <div className="event-body">
          <div className="event-body-left">
            <div className="event-body-left-event-details">
              <img
                className="event-body-left-event-details-image"
                src={
                  eventImage
                    ? eventImage.url
                    : "https://secure.meetupstatic.com/next/images/fallbacks/group-cover-2-wide.webp"
                }
              />

              <h2>Details</h2>
              <p>{event.description}</p>
            </div>
            <div>
              <h3>Attendees ({event.numAttending})</h3>
            </div>
            <div className="event-attendees">
              <ProfileCard />
            </div>
          </div>
          <div className="event-body-right">
            <div className="event-body-right-sticky-container">
              <div onClick={directToGroup} className="event-body-right-group-info-container">
                <div className="event-body-right-group-info-image-container">
                  {groupInfo?.previewImage ? (
                    <img
                      className="event-body-right-group-info-image"
                      src={groupInfo.previewImage}
                    />
                  ) : (
                    ""
                  )}
                </div>
                <div className="event-body-right-group-info">
                  <div className="event-body-right-group-info-title">
                    {groupInfo?.name}
                  </div>
                  <div className="event-body-righ-group-private-public">
                    {groupInfo?.private ? "Private Group" : "Public Group"}
                  </div>
                </div>
              </div>
              <div className="event-body-right-event-info-container">
                <div className="event-body-right-event-time-location-info">
                  <div class="icon">
                    <i class="fa-regular fa-clock fa-solid-event"></i>{" "}
                  </div>
                  <div class="event-body-right-event-info-right">
                    <div> Begins: {startTimeString} </div>
                    <div> Ends: {endTimeString} </div>
                  </div>
                </div>
                <div className="event-body-right-event-time-location-info bottom-container-info">
                  <div class="icon">
                    <i className="fa-solid fa-location-dot fa-solid-event"></i>{" "}
                  </div>
                  <div class="event-body-right-event-info-right">
                    {eventLocation}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="event-sticky-footer">
        <div className="event-sticky-footer-content">
          <div className="event-sticky-footer-event-info-left">
            <div className="event-sticky-footer-time-data">
              {startTimeString}
            </div>
            <div className="event-sticky-footer-title-data">{event.name}</div>
          </div>
          <div className="event-sticky-footer-event-buttons-right">
            <div
              ref={ulRef}
              className="event-sticky-footer-event-options"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              Event Actions <i class="fa-solid fa-angle-up"></i>
            </div>
            {showMenu && (
              <div className="event-sticky-footer-event-option-menu-container">
                <div className="event-sticky-footer-event-option-menu-inner-container">
                  {/* {userType} */}
                  <Link
                    className="event-sticky-menu-link"
                    to={`/events/${eventId}/edit`}
                  >
                    Edit Event
                  </Link>
                  <div>
                    <OpenModalMenuItem
                      itemText={<div className='event-sticky-menu-link'>Delete Event</div>}
                      onItemClick={closeMenu}
                      modalComponent={<DeleteModal eventId={event.id} type={'Event'} />}
                      />

                  </div>
                  <Link className="event-sticky-menu-link">Add Image</Link>
                </div>
              </div>
            )}
            <div className="event-sticky-footer-attend-button">Attend</div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default EventPage;
