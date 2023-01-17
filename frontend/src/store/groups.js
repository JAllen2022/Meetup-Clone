const GET_ALL_GROUPS = "groups/GET_ALL_GROUPS";

/* ----- ACTIONS ------ */
export const allGroups = groups => ({
    type: GET_ALL_GROUPS,
    payload:groups
});

/* ------ SELECTORS ------ */
export const getAllGroups = () => async dispatch => {
    const response = await fetch("/api/groups");

    if (response.ok) {
        const data = await response.json();
        dispatch(allGroups(data));
    }
}


/* ------ REDUCER ------ */
export default function groupReducer(state = {}, action) {
    switch (action.type) {
        case GET_ALL_GROUPS:
            return action.payload;
        default:
            return state;
    }
}
