import React from "react";
import { isImage, renderVideoTag } from "../../lib/util";
import styles from "./post.module.css";
import PropTypes from "prop-types";
import { ReactComponent as CommentsIcon } from "../../assets/icons/comments.svg";
import * as timeago from "timeago.js";

function Post({
  title,
  media,
  isVideo,
  url,
  permalink,
  subredditNamePrefixed,
  author,
  created,
  numComments,
  score,
}) {
  const subredditLink = `http://www.reddit.com${permalink}`;
  return (
    <li className={styles.post}>
      <nav className={styles.postNav}>
        <ul>
          <li>
            <a href={subredditLink}>{subredditNamePrefixed}</a>
          </li>
          <li>
            <a href={`https://www.reddit.com/u/${author}`}>
              Posted by u/{author} {timeago.format(created * 1000)}
            </a>
          </li>
        </ul>
      </nav>
      <div className={styles.score}>Score: {score}</div>
      <h2>
        <a href={subredditLink}>{title}</a>
      </h2>
      {isVideo && renderVideoTag(media.reddit_video)}
      {isImage(url) && <img src={url} alt={title} />}
      <div className={styles.comments}>
        <a href={subredditLink}>
          <span>
            <CommentsIcon />
          </span>
          <span>{numComments}</span>
          <span>{numComments > 0 ? "comments" : "comment"}</span>
        </a>
      </div>
    </li>
  );
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  isVideo: PropTypes.bool.isRequired,
  media: PropTypes.object,
  url: PropTypes.string.isRequired,
  permalink: PropTypes.string.isRequired,
  subredditNamePrefixed: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  created: PropTypes.number.isRequired,
  numComments: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
};

export default Post;
