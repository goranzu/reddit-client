import React, { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import PostList from "../components/post-list/PostList";
import useSubreddit from "../hooks/useSubreddit";
import { IDLE, LOADING, REJECTED, RESOLVED } from "../lib/constants";
import { apiClient } from "../lib/util";
import { ReactComponent as PlaceHolderSVG } from "../assets/icons/placeholder.svg";

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
    // TODO: Promise.all() to load all at once??
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

  const numberFormatter = new Intl.NumberFormat("nl-NL");

  const { status, data, error } = state;
  const { data: aboutData, status: aboutStatus } = aboutState;
  return (
    <main className="wrapper grid">
      {aboutStatus === RESOLVED && (
        <>
          <div className="subreddit-heading">
            {typeof aboutData.icon_img === "string" &&
            aboutData.icon_img.length > 1 ? (
              <img
                src={aboutData.icon_img}
                alt={`${aboutData.display_name} icon`}
              />
            ) : (
              <PlaceHolderSVG className="placeholder-svg" />
            )}
            <div>
              <h1>{aboutData.title}</h1>
              <p style={{ marginTop: ".3em" }}>
                {aboutData.display_name_prefixed}
              </p>
            </div>
          </div>
          <article className="info-card">
            <p>{aboutData.display_name_prefixed}</p>
            <h4>{aboutData.public_description}</h4>
            <section>
              <p>
                Members:{" "}
                <span className="lb">
                  {numberFormatter.format(aboutData.subscribers)}
                </span>
              </p>
              <p>
                Online:{" "}
                <span className="lb">
                  {numberFormatter.format(aboutData.accounts_active)}
                </span>
              </p>
            </section>
          </article>
        </>
      )}
      <PostList data={data} error={error} status={status} />
    </main>
  );
}

export default Subreddit;
