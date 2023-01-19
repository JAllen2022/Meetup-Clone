import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetSingleEvent } from "../../store/events";
import "./EventPage.css";
import { useEffect } from "react";

function EventPage() {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const event = useSelector((state) => state.events.singleEvent);

  useEffect(() => {
    dispatch(thunkGetSingleEvent(eventId));
  }, [dispatch]);

    return (
      <div className='event-page-container'>hello</div>
  )
}

export default EventPage;
