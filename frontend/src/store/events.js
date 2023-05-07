import { csrfFetch } from "./csrf";

const GET_ALL_EVENTS = "events/GET_ALL_EVENTS";
const GET_SINGLE_EVENT = "events/GET_SINGLE_EVENT";
const CREATE_EVENT = "events/CREATE_EVENT";
const EDIT_EVENT = "events/EDIT_EVENT";
const ADD_EVENT_IMAGE = "events/ADD_EVENT_IMAGE";
const RESET_SINGLE_EVENT = "events/RESET_SINGLE_EVENT";
const RESET_ALL_EVENTS = "events/RESET_ALL_EVENTS";
const DELETE_EVENT = "events/DELETE_EVENT";
const DELETE_ALL_GROUP_EVENTS = "events/DELETE_ALL_GROUP_EVENTS";
const GET_USER_EVENTS = "events/GET_USER_EVENTS";
const GET_HOMEPAGE_EVENTS = "events/GET_HOMEPAGE_EVENTS";

// Attendance
const GET_ATTENDEES = "events/GET_ATTENDEES";
const ADD_ATTENDANCE = "events/ADD_ATTENDANCE";
const EDIT_ATTENDANCE = "events/EDIT_ATTENDANCE";
const DELETE_ATTENDANCE = "evnets/REMOVE_ATTENDANCE";

const initialState = {
  allEvents: [],
  singleEvent: {},
  singleEventAttendees: {},
  userEvents: {},
  totalPages: {},
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
  payload: event,
});
export const editEvent = (event) => ({
  type: EDIT_EVENT,
  payload: event,
});

export const addEventImage = (eventImage, eventId) => ({
  type: ADD_EVENT_IMAGE,
  payload: { eventImage, eventId },
});

export const resetSingleEvent = () => ({
  type: RESET_SINGLE_EVENT,
});

export const deleteEvent = (eventId) => ({
  type: DELETE_EVENT,
  payload: eventId,
});

export const deleteAllGroupEvents = (groupId) => ({
  type: DELETE_ALL_GROUP_EVENTS,
  payload: groupId,
});

export const resetAllEvents = () => ({
  type: RESET_ALL_EVENTS,
});

export const getUserEvents = (events) => ({
  type: GET_USER_EVENTS,
  payload: events,
});

// Attendance
export const getAttendees = (attendees) => ({
  type: GET_ATTENDEES,
  payload: attendees,
});
export const addAttendance = (attendance) => ({
  type: ADD_ATTENDANCE,
  payload: attendance,
});

export const editAttendance = (attendance) => ({
  type: EDIT_ATTENDANCE,
  payload: attendance,
});

export const deleteAttendance = (attendance) => ({
  type: DELETE_ATTENDANCE,
  payload: attendance,
});

/* ------ SELECTORS ------ */
export const thunkGetAllEvents = (data) => async (dispatch) => {
  const searchParameters = new URLSearchParams(data).toString();
  const response = await fetch(`/api/events?${searchParameters}`);

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
  const response = await csrfFetch(`/api/groups/${groupId}/events`, {
    method: "POST",
    body: JSON.stringify(event),
  });

  if (response.ok) {
    const eventImage = await response.json();
    return dispatch(createEvent(eventImage));
  }
};

export const thunkEditEvent = (event, eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: "PUT",
    body: JSON.stringify(event),
  });

  if (response.ok) {
    const event = await response.json();
    return dispatch(editEvent(event));
  }
};

export const thunkAddEventImage = (imageObj, eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}/images`, {
    method: "POST",
    body: JSON.stringify(imageObj),
  });

  if (response.ok) {
    const eventImage = await response.json();
    dispatch(addEventImage(eventImage, eventId));
  }
};

export const thunkDeleteEvent = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    return dispatch(deleteEvent(eventId));
  }
};

export const thunkGetUserEvents = (data) => async (dispatch) => {
  const searchParameters = new URLSearchParams(data).toString();
  const response = await csrfFetch(`/api/events/current?${searchParameters}`);

  if (response.ok) {
    const events = await response.json();
    return dispatch(getUserEvents(events));
  }
};

export const thunkGetAttendees = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}/attendees`);

  if (response.ok) {
    const data = await response.json();
    return dispatch(getAttendees(data.Attendees));
  }
};

export const thunkAddAttendance = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}/attendance`, {
    method: "POST",
  }).catch((e) => e);
  console.log("checking our little thingy", response);
  if (response.ok) {
    const data = await response.json();
    return dispatch(addAttendance(data));
  } else return response;
};

export const thunkEditAttendance = (eventId, data) => async (dispatch) => {
  // Data is {userId, status}
  const response = await csrfFetch(`/api/events/${eventId}/attendance`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (response.ok) {
    const data = await response.json();
    return dispatch(editAttendance(data.Attendees));
  }
};

export const thunkDeleteAttendance = (eventId, data) => async (dispatch) => {
  // data is {userId}
  const response = await csrfFetch(`/api/events/${eventId}/attendance`, {
    method: "DELETE",
    body: JSON.stringify(data),
  });

  if (response.ok) {
    const data = await response.json();
    return dispatch(deleteAttendance(data.userId));
  }
};

/* ------ REDUCER ------ */
export default function eventsReducer(state = initialState, action) {
  const newState = { ...state };
  switch (action.type) {
    case GET_ALL_EVENTS:
      newState.allEvents = action.payload.Events;
      newState.totalPages = action.payload.totalPages;
      return newState;
    case GET_SINGLE_EVENT:
      newState.singleEvent = action.payload;
      return newState;
    case CREATE_EVENT:
      // Creating a new event ALWAYS resets all events object right now because object returned
      // does not provide sufficient information to add into the AllEvents object
      newState.allEvents = {};

      return newState;

    case EDIT_EVENT:
      newState.allEvents = { ...state.allEvents };
      newState.allEvents[action.payload.id] = {
        ...state.allEvents[action.payload.id],
        ...action.payload,
      };
      return newState;
    case ADD_EVENT_IMAGE:
      return newState;
    case RESET_SINGLE_EVENT:
      newState.singleEvent = {};
      newState.singleEventAttendees = {};
      return newState;
    case DELETE_EVENT:
      newState.allEvents = { ...state.allEvents };
      newState.allEvents[action.payload] = {
        ...state.allEvents[action.payload],
      };
      delete newState.allEvents[action.payload];
      return newState;
    case DELETE_ALL_GROUP_EVENTS:
      newState.allEvents = { ...state.allEvents };
      const groupId = action.payload;
      const eventIdsToDelete = [];
      Object.values(newState.allEvents).forEach((event) => {
        if (event.Group && event.Group.id === groupId) {
          eventIdsToDelete.push(event.id);
        } else if (event.groupId && event.groupId === groupId) {
          eventIdsToDelete.push(event.id);
        }
      });
      eventIdsToDelete.forEach((eventId) => {
        newState.allEvents[eventId] = { ...state.allEvents[eventId] };
        delete newState.allEvents[eventId];
      });
      return newState;
    case GET_ATTENDEES:
      const attendeesObj = {};
      action.payload.forEach((attendee) => {
        attendeesObj[attendee.id] = attendee;
      });
      newState.singleEventAttendees = attendeesObj;
      return newState;

    case ADD_ATTENDANCE: {
      const { userId, status } = action.payload;
      newState.singleEventAttendees = {
        ...state.singleEventAttendees,
        [userId]: { id: userId, Attendance: { status } },
      };
      return newState;
    }
    case EDIT_ATTENDANCE: {
      const { userId, status } = action.payload;
      newState.singleEventAttendees = {
        ...state.singleEventAttendees,
        [userId]: {
          ...state.singleEventAttendees[userId],
          Attendance: { status },
        },
      };
      return newState;
    }
    case DELETE_ATTENDANCE:
      newState.singleEventAttendees = {
        ...state.singleEventAttendees,
      };
      delete newState.singleEventAttendees[action.payload];
      return newState;
    case RESET_ALL_EVENTS:
      newState.allEvents = {};
      return newState;

    case GET_USER_EVENTS:
      const eventsObj = {};
      const events = action.payload.Events;
      events.forEach((event) => (eventsObj[event.id] = event));
      newState.userEvents = eventsObj;
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
