const GET_ALL_GROUPS = "groups/GET_ALL_GROUPS";
const GET_SINGLE_GROUP = "groups/GET_SINGLE_GROUP";
const GET_GROUP_EVENTS = 'groups/GET_GROUP_EVENTS'
const initialState = {
  allGroups: {},
  singleGroup: {},
  singleGroupEvents: {}
};

/* ----- ACTIONS ------ */
export const allGroups = (groups) => ({
  type: GET_ALL_GROUPS,
  payload: groups,
});

export const singleGroup = (group) => ({
  type: GET_SINGLE_GROUP,
  payload: group,
});

export const groupEvents = (events) => ({
  type: GET_GROUP_EVENTS,
  payload: events
})

/* ------ SELECTORS ------ */
export const getAllGroups = () => async (dispatch) => {
  const response = await fetch("/api/groups");

  if (response.ok) {
    const data = await response.json();
    dispatch(allGroups(data));
  }
};

export const getSingleGroup = (groupId) => async (dispatch) => {
  const response = await fetch(`/api/groups/${groupId}`);

  if (response.ok) {
    const data = await response.json();
    dispatch(groupEvents(data));
  }
};

export const getGroupEvents = (groupId) => async (dispatch) => {
  const response = await fetch(`/api/groups/${groupId}/events`);

  if (response.ok) {
    const data = await response.json();
    dispatch(groupEvents(data.Events));
  }
}

/* ------ REDUCER ------ */
export default function groupReducer(state = initialState, action) {
  const newState = { ...state };
  switch (action.type) {
    case GET_ALL_GROUPS:
      newState.allGroups = normalize(action.payload.Groups);
      return newState;
    case GET_SINGLE_GROUP:
      newState.singleGroup = action.payload;
      return newState;
    case GET_GROUP_EVENTS:
      newState.singleGroupEvents = normalize(action.payload);
      return newState;
    default:
      return state;
  }
}

function normalize(array) {
  const obj = {};
  console.log("what the hello",array[0]);
  array.forEach((ele) => {
    obj[ele.id] = ele;
  });
  return obj;
}
