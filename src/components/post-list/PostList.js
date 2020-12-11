import React from "react";
import { LOADING, REJECTED, RESOLVED } from "../../lib/constants";
import Loader from "../loader/Loader";
import Post from "../post/Post";
import PropTypes from "prop-types";

function PostList({ status, error, data }) {
  return (
    <>
      {status === REJECTED && <p>{JSON.stringify(error, null, 2)}</p>}
      {status === LOADING && <Loader />}
      {status === RESOLVED && (
        <ul className="post-list">
          {data.map(({ data }) => (
            <Post
              title={data.title}
              isVideo={data.is_video}
              media={data.media}
              permalink={data.permalink}
              url={data.url}
              key={data.id}
              subredditNamePrefixed={data.subreddit_name_prefixed}
              author={data.author}
              created={data.created_utc}
              numComments={data.num_comments}
              score={data.score}
            />
          ))}
        </ul>
      )}
    </>
  );
}

PostList.propTypes = {
  status: PropTypes.string.isRequired,
  error: PropTypes.string,
  data: PropTypes.array.isRequired,
};

export default PostList;
