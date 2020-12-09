import React from "react";
import styles from "./autocomplete.module.css";

function AutoComplete({
  autocompleteOptions,
  setSubreddit,
  fetchSubreddit,
  reset,
}) {
  return (
    <ul className={styles.autocomplete}>
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

export default AutoComplete;
