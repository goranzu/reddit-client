import React from "react";
import { isImage, renderVideoTag } from "../../lib/util";

function Post({ post }) {
  return (
    <li className="card">
      {post.is_video && renderVideoTag(post.media.reddit_video)}
      {isImage(post.url) && <img src={post.url} alt={post.title} />}
      <h2>{post.title}</h2>
      <a href={`https://www.reddit.com${post.permalink}`}>comments</a>
    </li>
  );
}

export default Post;
