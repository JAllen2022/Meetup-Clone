import { csrfFetch } from "./csrf";
import { deleteAllGroupEvents } from "./events";
const GET_ALL_GROUPS = "groups/GET_ALL_GROUPS";
const GET_SINGLE_GROUP = "groups/GET_SINGLE_GROUP";
const GET_GROUP_EVENTS = "groups/GET_GROUP_EVENTS";
const CREATE_GROUP = "groups/CREATE_GROUP";
const RESET_SINGLE_GROUP = "groups/RESET_SINGLE_GROUP";
const RESET_ALL_GROUPS = "groups/RESET_ALL_GROUPS";
const UPDATE_GROUP = "groups/UPDATE_GROUP";
const DELETE_GROUP = "groups/DELETE_GROUP";
const ADD_GROUP_IMAGE = "groups/ADD_GROUP_IMAGE";
const GET_MEMBERSHIPS = "groups/GET_MEMBERSHIPS";
const GET_USER_GROUPS = "groups/GET_USER_GROUPS";

const initialState = {
  allGroups: {},
  singleGroup: {},
  groupEvents: {},
  singleGroupMemberships: {},
  userGroups: {},
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
  payload: events,
});

export const createGroup = (group) => ({
  type: CREATE_GROUP,
  payload: group,
});

export const resetSingleGroup = () => ({
  type: RESET_SINGLE_GROUP,
});

export const updateGroup = (group) => ({
  type: UPDATE_GROUP,
  payload: group,
});

export const deleteGroup = (groupId) => ({
  type: DELETE_GROUP,
  payload: groupId,
});

export const addGroupImage = (newImage, groupId) => ({
  type: ADD_GROUP_IMAGE,
  payload: { newImage, groupId },
});

export const getMemberships = (memberships) => ({
  type: GET_MEMBERSHIPS,
  payload: memberships,
});

export const resetAllGroups = () => ({
  type: RESET_ALL_GROUPS,
});

export const getUserGroups = (groups) => ({
  type: GET_USER_GROUPS,
  payload: groups,
});

/* ------ SELECTORS ------ */
export const thunkGetAllGroups = (data) => async (dispatch) => {
  const searchParameters = new URLSearchParams(data).toString();
  const response = await fetch(`/api/groups?${searchParameters}`);

  if (response.ok) {
    const data = await response.json();
    return dispatch(allGroups(data));
  }
};

export const thunkGetSingleGroup = (groupId) => async (dispatch) => {
  const response = await fetch(`/api/groups/${groupId}`);

  if (response.ok) {
    const data = await response.json();
    return dispatch(singleGroup(data));
  }
};

export const thunkGetGroupEvents = (groupId, data) => async (dispatch) => {
  const searchParameters = new URLSearchParams(data).toString();
  const response = await fetch(
    `/api/groups/${groupId}/events${searchParameters}`
  );

  if (response.ok) {
    const data = await response.json();
    dispatch(groupEvents(data));
  }
};

export const thunkCreateGroup = (groupInformation) => async (dispatch) => {
  const response = await csrfFetch("/api/groups", {
    method: "POST",
    body: JSON.stringify(groupInformation),
  });

  if (response.ok) {
    const data = await response.json();
    return dispatch(createGroup(data));
  }
};

export const thunkUpdateGroup = (groupInformation) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupInformation.id}`, {
    method: "PUT",
    body: JSON.stringify(groupInformation),
  });

  if (response.ok) {
    const data = await response.json();
    return dispatch(updateGroup(data));
  }
};

export const thunkDeleteGroup = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(deleteAllGroupEvents(groupId));
    return dispatch(deleteGroup(groupId));
  }
};

export const thunkAddGroupImage = (newImage, groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/images`, {
    method: "POST",
    body: JSON.stringify(newImage),
  });

  if (response.ok) {
    const imgObj = await response.json();
    return dispatch(addGroupImage(imgObj, groupId));
  }
};

export const thunkGetMemberships = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/members`);

  if (response.ok) {
    const data = await response.json();
    return dispatch(getMemberships(data.Members));
  }
};

export const thunkGetUserGroups = () => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/current`);

  if (response.ok) {
    const groups = await response.json();
    return dispatch(getUserGroups(groups));
  }
};

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

    case GET_GROUP_EVENTS: {
      const newObj = {};
      const events = action.payload.Events;
      events.map((ele) => (newObj[ele.id] = ele));
      newState.groupEvents = newObj;
      return newState;
    }

    case CREATE_GROUP:
      if (Object.values(newState.allGroups).length) {
        newState.allGroups = { ...state.allGroups };
        newState.allGroups[action.payload.id] = action.payload;
      }
      return newState;

    case RESET_SINGLE_GROUP:
      newState.singleGroup = {};
      newState.groupEvents = {};
      return newState;

    case UPDATE_GROUP:
      if (newState.allGroups) {
        newState.allGroups = { ...state.allGroups };
        newState.allGroups[action.payload.id] = {
          ...state.allGroups[action.payload.id],
        };
        newState.allGroups[action.payload.id] = {
          ...newState.allGroups[action.payload.id],
          ...action.payload,
        };
      }
      return newState;

    case DELETE_GROUP:
      if (newState.allGroups[action.payload]) {
        newState.allGroups = { ...newState.allGroups };
        delete newState.allGroups[action.payload];
      }
      newState.singleGroup = {};
      return newState;
    case ADD_GROUP_IMAGE:
      // If new group created has an image preview property of true, then add it to all groups
      const { newImage, groupId } = action.payload;
      if (Object.values(newState.allGroups).length) {
        newState.allGroups = { ...state.allGroups };
        newState.allGroups[groupId].previewImage = newImage.preview
          ? newImage.url
          : null;
      }
      return newState;

    case GET_MEMBERSHIPS:
      const membersObj = {};
      action.payload.forEach((ele) => {
        membersObj[ele.id] = ele;
      });
      newState.singleGroupMemberships = membersObj;
      return newState;

    case RESET_ALL_GROUPS:
      newState.allGroups = {};
      return newState;

    case GET_USER_GROUPS:
      const newObj = {};
      const groups = action.payload.Groups;
      groups.map((ele) => (newObj[ele.id] = ele));
      newState.userGroups = newObj;
      return newState;

    default:
      return state;
  }
}

function normalize(array) {
  const obj = {};
  array.forEach((ele) => {
    obj[ele.id] = ele;
  });

  return obj;
}
