const SET_SEARCH = "search/SET_SEARCH";
const RESET_SEARCH = "search/RESET_SEARCH";

const initialState = { searchText: "" };

/* ----- ACTIONS ------ */

export const setSearch = (search) => ({
  type: SET_SEARCH,
  payload: search,
});

export const resetSearch = () => ({
  type: RESET_SEARCH,
});

export default function searchReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SEARCH:
      return { searchText: action.payload };
    case RESET_SEARCH:
      return initialState;
    default:
      return state;
  }
}
