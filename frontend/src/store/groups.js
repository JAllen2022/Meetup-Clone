import { csrfFetch } from "./csrf";
import {deleteAllGroupEvents} from './events'
const GET_ALL_GROUPS = "groups/GET_ALL_GROUPS";
const GET_SINGLE_GROUP = "groups/GET_SINGLE_GROUP";
const GET_GROUP_EVENTS = "groups/GET_GROUP_EVENTS";
const CREATE_GROUP = "groups/CREATE_GROUP";
const RESET_SINGLE_GROUP = "groups/RESET_SINGLE_GROUP";
const RESET_GROUP_EVENTS = 'groups/RESET_GROUP_EVENTS';
const UPDATE_GROUP = "groups/UPDATE_GROUP";
const DELETE_GROUP = "groups/DELETE_GROUP";
const ADD_GROUP_IMAGE = "groups/ADD_GROUP_IMAGE";

const initialState = {
  allGroups: {},
  singleGroup: {},
  groupEvents: {},
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

export const resetGroupEvents = () => ({
  type: RESET_GROUP_EVENTS,
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
  payload: {newImage,groupId},
});

/* ------ SELECTORS ------ */
export const thunkGetAllGroups = () => async (dispatch) => {
  const response = await fetch("/api/groups");

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

export const thunkGetGroupEvents = (groupId) => async (dispatch) => {
  const response = await fetch(`/api/groups/${groupId}/events`);

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

/* ------ REDUCER ------ */
export default function groupReducer(state = initialState, action) {
  const newState = { ...state };
  switch (action.type) {
    case GET_ALL_GROUPS:
      newState.allGroups = normalize(action.payload.Groups);
      return newState;

    case GET_SINGLE_GROUP:
      console.log("checking previous state for get single group", state);

      newState.singleGroup = action.payload;
      return newState;

    case GET_GROUP_EVENTS: {
      console.log("checking previous state for get events", state);
      const newObj = {};
      const events = action.payload.Events;
      events.map((ele) => (newObj[ele.id] = ele));
      newState.groupEvents = newObj;
      return newState;
    }

    case CREATE_GROUP:
      if (Object.values(newState.allGroups).length) {
        newState.allGroups[action.payload.id] = action.payload;
        console.log("checking all groups", newState);
        console.log("checking all action.payload", action.payload);
      }
      return newState;

    case RESET_SINGLE_GROUP:
      newState.singleGroup = {};
      return newState;

    case RESET_GROUP_EVENTS:
      newState.groupEvents = {};
      return newState;

    case UPDATE_GROUP:
      if (newState.allGroups) {
        newState.allGroups = { ...state.allGroups };
        newState.allGroups[action.payload.id] = {
          ...state.allGroups[action.payload.id],
        };
        newState.allGroups[action.payload.id] = {...newState.allGroups[action.payload.id],...action.payload};
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
      if (Object.values(newState.allGroups).length) {
        const { newImage, groupId } = action.payload;
        console.log("groupId, new Image", newImage, groupId);
        if (newImage.preview)
          newState.allGroups[groupId].previewImage = newImage.url;
      }
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
