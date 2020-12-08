import React from "react";

function AutoComplete({
  autocompleteOptions,
  setSubreddit,
  fetchSubreddit,
  reset,
}) {
  return (
    <ul>
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
