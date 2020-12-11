import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import PostList from "../components/post-list/PostList";
import useSubreddit from "../hooks/useSubreddit";

function Subreddit() {
  const { subreddit } = useParams();
  const [state, fetch] = useSubreddit();

  useEffect(() => {
    fetch(subreddit);
  }, [fetch, subreddit]);

  const { status, data, error } = state;
  return (
    <main className="wrapper">
      <PostList data={data} error={error} status={status} />
    </main>
  );
}

export default Subreddit;
