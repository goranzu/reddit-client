import React, { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import PostList from "../components/post-list/PostList";
import useSubreddit from "../hooks/useSubreddit";
import { IDLE, LOADING, REJECTED, RESOLVED } from "../lib/constants";
import { apiClient } from "../lib/util";

const initialState = {
  status: IDLE,
  data: {},
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
    default:
      return { ...state };
  }
}

function Subreddit() {
  const { subreddit } = useParams();
  const [state, fetch] = useSubreddit();

  const [aboutState, dispatch] = useReducer(reducer, initialState);

  document.title = `/r/${subreddit}`;

  useEffect(() => {
    (async () => {
      await fetch(subreddit);

      (async function fetchSubredditDetails() {
        try {
          dispatch({ type: LOADING });
          const data = await apiClient(
            `https://www.reddit.com/r/${subreddit}/about.json`,
          );
          dispatch({ type: RESOLVED, payload: { data: data.data } });
        } catch (error) {
          dispatch({ type: REJECTED, payload: { error: error.message } });
        }
      })();
    })();
  }, [fetch, subreddit]);

  console.log(aboutState);

  const { status, data, error } = state;
  const { data: aboutData, status: aboutStatus } = aboutState;
  return (
    <main className="wrapper">
      {aboutStatus === RESOLVED && (
        <>
          <p>{aboutData.display_name_prefixed}</p>
          <h3>{aboutData.public_description}</h3>
        </>
      )}
      <PostList data={data} error={error} status={status} />
    </main>
  );
}

export default Subreddit;
