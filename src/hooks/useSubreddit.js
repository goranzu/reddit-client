import { useCallback, useReducer } from "react";
import { IDLE, LOADING, REJECTED, RESOLVED } from "../lib/constants";
import { apiClient } from "../lib/util";

const initialState = {
  data: [],
  status: IDLE,
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case LOADING:
      return { ...state, status: LOADING };
    case RESOLVED:
      return { ...state, status: RESOLVED, data: action.payload.data };
    case REJECTED:
      return { ...state, status: REJECTED, error: action.payload.error };
    default:
      return { ...state };
  }
}

function useSubreddit() {
  const [state, dispatch] = useReducer(reducer, initialState);

  async function f(
    subreddit = "all",
    url = `https://www.reddit.com/r/${subreddit}.json`,
  ) {
    try {
      console.log(url);
      dispatch({ type: LOADING });
      const response = await apiClient(url);
      dispatch({
        type: RESOLVED,
        payload: { data: response?.data?.children || [] },
      });
    } catch (error) {
      dispatch({ type: REJECTED, payload: { error: error.message } });
    }
  }

  const fetchData = useCallback((subreddit, url) => {
    f(subreddit, url);
  }, []);

  return [state, fetchData];
}

export default useSubreddit;
