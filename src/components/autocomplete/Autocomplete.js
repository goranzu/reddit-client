import React from "react";
import styles from "./autocomplete.module.css";
import PropTypes from "prop-types";

function AutoComplete({
  autocompleteOptions,
  setSubreddit,
  fetchSubreddit,
  reset,
}) {
  return (
    <ul className={`${styles.autocomplete} au-form`}>
      {autocompleteOptions.map((c) => (
        <li key={c}>
          <button
            onClick={function handleAutoCompleteClick() {
              setSubreddit(c);
              reset();
              fetchSubreddit(c);
            }}
          >
            {c}
          </button>
        </li>
      ))}
    </ul>
  );
}

AutoComplete.propTypes = {
  autocompleteOptions: PropTypes.array.isRequired,
  setSubreddit: PropTypes.func.isRequired,
  fetchSubreddit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};

export default AutoComplete;
