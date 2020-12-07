import React from "react";

function AutoComplete({ autocompleteOptions, setSubreddit, fetchSubreddit }) {
  return (
    <ul>
      {autocompleteOptions.map((c) => (
        <li key={c}>
          <button
            onClick={function handleAutoCompleteClick(e) {
              setSubreddit(e.target.textContent);
              autocompleteOptions = [];
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
