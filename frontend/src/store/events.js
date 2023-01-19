const GET_ALL_EVENTS = "events/GET_ALL_EVENTS";
const GET_SINGLE_EVENT = "events/GET_SINGLE_EVENT";
const initialState = {
  allEvents: {},
  singleEvent: {},
};

/* ----- ACTIONS ------ */
export const allEvents = (events) => ({
  type: GET_ALL_EVENTS,
  payload: events,
});

export const getSingleEvent = (event) => ({
  type: GET_SINGLE_EVENT,
  payload: event,
});

/* ------ SELECTORS ------ */
export const thunkGetAllEvents = () => async (dispatch) => {
  const response = await fetch("/api/events");

  if (response.ok) {
    const events = await response.json();
    dispatch(allEvents(events));
  }
};

export const thunkGetSingleEvent = (eventId) => async (dispatch) => {
  const response = await fetch(`/api/events/${eventId}`);

  if (response.ok) {
    const event = await response.json();
    dispatch(getSingleEvent(event));
  }
};

/* ------ REDUCER ------ */
export default function eventsReducer(state = initialState, action) {
  const newState = { ...state };
  switch (action.type) {
    case GET_ALL_EVENTS:
      newState.allEvents = normalize(action.payload.Events);
      return newState;
    case GET_SINGLE_EVENT:
      newState.singleEvent = action.payload;
      return newState;
    default:
      return newState;
  }
}

function normalize(array) {
  const obj = {};
  array.forEach((ele) => {
    obj[ele.id] = ele;
  });
  return obj;
}
