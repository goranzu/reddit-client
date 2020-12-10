import React from "react";
import { isImage, renderVideoTag } from "../../lib/util";
import styles from "./post.module.css";
import PropTypes from "prop-types";

function Post({ post }) {
  return (
    <li className={styles.post}>
      <h2>{post.title}</h2>
      {post.is_video && renderVideoTag(post.media.reddit_video)}
      {isImage(post.url) && <img src={post.url} alt={post.title} />}
      <a href={`https://www.reddit.com${post.permalink}`}>comments</a>
    </li>
  );
}

Post.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    is_video: PropTypes.bool.isRequired,
    media: PropTypes.object,
    url: PropTypes.string.isRequired,
    permalink: PropTypes.string.isRequired,
  }),
};

export default Post;
