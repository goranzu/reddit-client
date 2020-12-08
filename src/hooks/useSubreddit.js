import { useCallback, useReducer } from "react";
import { IDLE, LOADING, REJECTED, RESOLVED } from "../lib/constants";
import { apiClient } from "../lib/util";

const initialState = {
  status: IDLE,
  data: [],
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case LOADING:
      return { ...initialState, status: LOADING };
    case RESOLVED:
      return { ...initialState, status: RESOLVED, data: action.payload.data };
    case REJECTED:
      return { ...initialState, status: REJECTED, error: action.payload.error };
    case IDLE:
      return { ...initialState };
    default:
      return { ...state };
  }
}

function useSubreddit() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Wrapped in useCallback because this gets called in a Apps useEffect hook.
  const fetch = useCallback(async function fetch(
    subreddit = "all",
    url = `https://www.reddit.com/r/${subreddit}.json`,
  ) {
    try {
      dispatch({ type: LOADING });
      const data = await apiClient(url);
      dispatch({
        type: RESOLVED,
        payload: { data: data?.data?.children || [] },
      });
    } catch (error) {
      dispatch({ type: REJECTED, payload: { error: error.message } });
    }
  },
  []);

  function reset() {
    dispatch({ type: IDLE });
  }

  return [state, fetch, reset];
}

export default useSubreddit;
