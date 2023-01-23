import { useParams, useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { thunkGetSingleEvent, thunkGetAttendees } from "../../store/events";
import { thunkGetMemberships } from "../../store/groups";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteModal from "../DeleteModal";
import formatDateString from "../../util/formatDateString.js";
import ProfileCard from "../ProfileCard";
import "./EventPage.css";
import FeatureComingSoon from "../FeatureComingSoon";

function EventPage() {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const ulRef = useRef();
  const event = useSelector((state) => state.events.singleEvent);
  const user = useSelector((state) => state.session.user);
  const [eventImage, setEventImage] = useState();
  const [showMenu, setShowMenu] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);
  const groupInfo = event.Group;
  const venueInfo = event.Venue;
  const closeMenu = () => setShowMenu(false);
  const memberships = useSelector(
    (state) => state.groups.singleGroupMemberships
  );
  const attendees = useSelector((state) => state.events.singleEventAttendees);
  const attendeesArray = Object.values(attendees).slice(0, 4);
  const host = Object.values(attendees).find(
    (ele) => ele.Attendance.status === "host"
  );
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

  const directToGroup = () => history.push(`/groups/${groupInfo.id}/about`);
  console.log('checking allowed edit ',allowEdit)

  // This is where we set the 'Event Options button dependent on the user's status
  useEffect(() => {
    if (memberships) {
      const membershipStatus = Object.values(memberships).find((ele) => {
        return ele.id === user.id;
      });
      if (membershipStatus) {
        if (
          membershipStatus.Membership.status === "co-host" ||
          membershipStatus.Membership.status === "host"
        ) {
          setAllowEdit(true);
        }
      }
    }
  }, [memberships]);

  // Get Group Memberships - this is necessary to determine what permissions a user has throughout the page
  // If user is co-host or organizer of the group, then they can edit the event
  useEffect(() => {
    if (event.Group) dispatch(thunkGetMemberships(event.Group.id));
  }, [event]);

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
    dispatch(thunkGetAttendees(eventId));
    setAllowEdit(false)
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
              <div>
                {host ? `${host.firstName} ${host?.lastName}` : "Somebody"}
              </div>
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
              {attendees
                ? attendeesArray.map((ele) => (
                    <ProfileCard key={ele.id} member={ele} />
                  ))
                : null}
            </div>
          </div>
          <div className="event-body-right">
            <div className="event-body-right-sticky-container">
              <div
                onClick={directToGroup}
                className="event-body-right-group-info-container"
              >
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
            {allowEdit && (
              <>
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
                          itemText={
                            <div className="event-sticky-menu-link">
                              Delete Event
                            </div>
                          }
                          onItemClick={closeMenu}
                          modalComponent={
                            <DeleteModal eventId={event.id} type={"Event"} />
                          }
                        />
                      </div>
                      {/* <Link className="event-sticky-menu-link">Add Image</Link> */}
                    </div>
                  </div>
                )}
              </>
            )}
            <div className="event-sticky-footer-attend-button">
              <OpenModalMenuItem
                itemText={<div className="">Attend</div>}
                modalComponent={<FeatureComingSoon eventId={event.id} />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default EventPage;
