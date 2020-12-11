import React from "react";
import styles from "./autocomplete.module.css";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

function AutoComplete({
  autocompleteOptions,
  setSubreddit,
  reset,
  setShowAutocomplete,
}) {
  let history = useHistory();

  function handleClick(subreddit) {
    setSubreddit(subreddit);
    reset();
    setShowAutocomplete(false);
    history.push(`/r/${subreddit}`);
  }

  return (
    <ul className={`${styles.autocomplete} au-form`}>
      {autocompleteOptions.map((c) => (
        <li key={c}>
          <button onClick={() => handleClick(c)}>{c}</button>
        </li>
      ))}
    </ul>
  );
}

AutoComplete.propTypes = {
  autocompleteOptions: PropTypes.array.isRequired,
  setSubreddit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  setShowAutocomplete: PropTypes.func.isRequired,
};

export default AutoComplete;
