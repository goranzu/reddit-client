import React from "react";
import { isImage, renderVideoTag } from "../../lib/util";
import styles from "./post.module.css";

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

export default Post;
