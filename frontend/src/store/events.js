import { csrfFetch } from "./csrf";

const GET_ALL_EVENTS = "events/GET_ALL_EVENTS";
const GET_SINGLE_EVENT = "events/GET_SINGLE_EVENT";
const CREATE_EVENT = 'events/CREATE_EVENT'
const EDIT_EVENT = "events/EDIT_EVENT";
const ADD_EVENT_IMAGE = 'events/ADD_EVENT_IMAGE'
const RESET_SINGLE_EVENT ='events/RESET_SINGLE_EVENT'

const initialState = {
  allEvents: {},
  singleEvent: {
  },
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

export const createEvent = (event) => ({
  type: CREATE_EVENT,
  payload: event
})
export const editEvent = (event) => ({
  type: EDIT_EVENT,
  payload: event,
});

export const addEventImage = (eventImage,eventId) => ({
  type: ADD_EVENT_IMAGE,
  payload: { eventImage, eventId }
})

export const resetSingleEvent = () => ({
  type: RESET_SINGLE_EVENT
})

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

export const thunkCreateEvent = (event, groupId) => async (dispatch) => {
  console.log('checking my create objects', event, groupId)
  const response = await csrfFetch(`/api/groups/${groupId}/events`, {
    method: 'POST',
    body: JSON.stringify(event)
  });
  console.log("checking my create objects", event, groupId);


  if (response.ok) {
    const eventImage = await response.json();
    return dispatch(createEvent(eventImage));
  }
}

export const thunkEditEvent = (event, eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: "PUT",
    body: JSON.stringify(event)
  });

  if (response.ok) {
    const event = await response.json();
    return dispatch(editEvent(event));
  }
};

export const thunkAddEventImage = (imageURL, eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}/images`, {
    method:'POST'
  })

  if (response.ok) {
    const eventImage = await response.json();
    dispatch(addEventImage(eventImage, eventId));
  }
}

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
    case CREATE_EVENT:
      newState.allEvents = { ...newState.allEvents };
      newState.allEvents[action.payload.id] = action.payload;
      newState.singleEvent = {...newState.singleEvent, ...action.payload};
      return newState;
    case EDIT_EVENT:
      newState.allEvents = { ...newState.allEvents };
      newState.allEvents[action.payload.id] = action.payload;
      newState.singleEvent = {...newState.singleEvent, ...action.payload};
      return newState;
    case ADD_EVENT_IMAGE:
      const { eventImage, eventId } = action.payload;
      newState.allEvents = { ...newState.allEvents };
      newState.allEvents[eventId] = { ...newState.allEvents[eventId] }
      if (newState.allEvents[eventId].EventImages) {
        newState.allEvents[eventId].EventImages = [
          ...newState.allEvents[eventId].EventImages,
        ];
        newState.allEvents[eventId].EventImages.push(eventImage);
      } else if (!newState.allEvents[eventId].EventImages) {
        newState.allEvents[eventId].EventImages=[eventImage];
      }
      return newState;
    case RESET_SINGLE_EVENT:
      newState.singleEvent = {}
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
