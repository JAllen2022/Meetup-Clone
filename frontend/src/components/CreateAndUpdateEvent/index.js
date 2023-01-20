import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  thunkCreateEvent,
  thunkEditEvent,
} from "../../store/events";
import "../CreateAndUpdateGroup";
import "./CreateAndUpdateEvent.css";

function CreateAndUpdateEvent() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [price, setPrice] = useState(0);
  const [venueId, setVenueId] = useState("");
  // Create ability to add a new venue as well
  //   const [city, setCity] = useState("");
  //   const [state, setState] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [eventImage, setEventImage] = useState("");
  const [errors, setErrors] = useState([]);
  const event = useSelector((state) => state.events.singleEvent);
  const dispatch = useDispatch();
  const history = useHistory();
  const { groupId, eventId } = useParams();

  const editPage = window.location.href.includes("edit") ? true : false;

  useEffect(() => {
    if (editPage) {
      setVenueId(event.venueId ? event.venueId : "");
      setName(event.name ? event.name : "");
      setType(event.type ? event.type : "");
      setCapacity(event.capacity ? event.capacity : false);
      setPrice(event.price ? event.price : false);
      setDescription(event.description ? event.description : false);
      setStartDate(event.startDate ? event.startDate : false);
      setEndDate(event.endDate ? event.endDate : false);
    }
  }, [event]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...event,
      venueId: venueId ? venueId : null,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    };

    setErrors([]);
    if (!editPage) {
      dispatch(thunkCreateEvent(payload, groupId))
        .then((data) => {
          history.push(`/events/${data.payload.id}`);
        })
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(Object.values(data.errors));
          else setErrors([data.message]);
        });
    } else {
      dispatch(thunkEditEvent(payload))
        .then((data) => {
          history.push(`/events/${data.payload.id}`);
        })
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(Object.values(data.errors));
          else setErrors([data.message]);
        });
    }
  };

  const cancelForm = (e) => {
    e.preventDefault();
    if (editPage) history.push(`/events/${event.id}`);
    else history.goBack();
  };

  return (
    <div className="create-group-container">
      <h1 className="create-group-title">
        {editPage ? "Update Event:" : "Create a Event:"}
      </h1>
      <form className="create-group-form" onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li className="errors" key={idx}>
              {error}
            </li>
          ))}
        </ul>
        <div>
          <label className="form-label">Event Name</label>
          <input
            className="form-inputs"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div>
          <label className="form-label">Capacity</label>
          <input
            className="form-inputs"
            type="text"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          ></input>
        </div>
        <div>
          <label className="form-label">Price</label>
          <input
            className="form-inputs"
            type="number"
            step="0.01"
            min="0.00"
            placeholder="0.00 represents a free event!"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          ></input>
        </div>
        <div>
          <label className="form-label">Start date</label>
          <input
            className="form-inputs"
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          ></input>
        </div>
        <div>
          <label className="form-label">End date</label>
          <input
            className="form-inputs"
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          ></input>
        </div>
        <div>
          <label className="form-label">Venue Id</label>
          <input
            className="form-inputs"
            type="number"
            value={venueId}
            onChange={(e) => setVenueId(e.target.value)}
          ></input>
        </div>
        <div>
          <label className="form-label">Event Image</label>
          <input
            className="form-inputs"
            type="url"
            placeholder="www.image.url"
            value={eventImage}
            onChange={(e) => setEventImage(e.target.value)}
          ></input>
        </div>
        <div>
          <label className="form-label">Description</label>
          <textarea
            className="form-inputs"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="form-radio">
          <label htmlFor="online-option">Online</label>
          <input
            id="online-option"
            type="radio"
            value="online"
            checked={type === "Online"}
            onChange={() => setType("Online")}
          ></input>

          <label id="in-person" htmlFor="in-person-option">
            In person
          </label>
          <input
            id="in-person-option"
            type="radio"
            value="in-person"
            checked={type === "In person"}
            onChange={() => setType("In person")}
          ></input>
        </div>

        <div className="form-end-button-container">
          <button
            className="form-submit-button create-cancel"
            type="submit"
            onClick={cancelForm}
          >
            Cancel
          </button>
          <button className="form-submit-button create-cancel" type="submit">
            {editPage ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateAndUpdateEvent;
