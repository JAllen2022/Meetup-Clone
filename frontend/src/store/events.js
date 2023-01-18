const initialState = {
    allEvents: {},
    singleEvent: {}
};
const GET_ALL_EVENTS = 'events/GET_ALL_EVENTS';

/* ----- ACTIONS ------ */
export const allEvents = (events) => ({
    type: GET_ALL_EVENTS,
    payload:events
})

/* ------ SELECTORS ------ */
export const getAllEvents = () => async dispatch => {
    const response = await fetch('/api/events');

    if (response.ok) {
        const events = await response.json();
        dispatch(allEvents(events));
    }
}


/* ------ REDUCER ------ */
export default function eventsReducer(state = initialState, action) {
    const newState = { ...state }
    switch (action.type) {
        case GET_ALL_EVENTS:
            newState.allEvents = normalize(action.payload.Events);
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
