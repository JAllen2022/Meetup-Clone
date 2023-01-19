import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetSingleEvent } from "../../store/events";
import "./EventPage.css";
import { useEffect, useState } from "react";

function EventPage() {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const event = useSelector((state) => state.events.singleEvent);
  console.log("checking my eventimages", event.EventImages);
  const [eventImage, setEventImage] = useState();
  const groupInfo = event.Group;
  console.log('groupinfo', groupInfo)

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
              {eventImage ? (
                <img
                  className="event-body-left-event-details-image"
                  src={eventImage.url}
                />
              ) : (
                eventImage
              )}
              <h2>Details</h2>
              <p>{event.description}</p>
            </div>
            <div>
              <h3>Attendees</h3>
            </div>
            <div className="event-attendees">
              <div className="event-attendees-profile-card">
                <div className="event-attendees-profile-inner-card">
                  <div className="event-attendees-profile-image">
                    <span>
                      <i className="fa-sharp fa-solid fa-circle-user event-profile"></i>
                    </span>
                  </div>
                  <div className="event-attendees-profile-name">Username</div>
                </div>
              </div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          <div className="event-body-right">
            <div className="event-body-right-group-info-container">
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
                <div className='event-body-righ-group-private-public'>
                  {groupInfo?.private ? "Private Group" : "Public Group"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventPage;
