import React, { useRef, useState } from "react";
import useSubreddit from "../../hooks/useSubreddit";
import { RESOLVED } from "../../lib/constants";
import { debounce } from "../../lib/util";
import AutoComplete from "../autocomplete/Autocomplete";

function SearchForm({ fetchSubreddit }) {
  const [state, fetchReddit] = useSubreddit();
  const [subreddit, setSubreddit] = useState("");
  const suggestionsRef = useRef(null);
  const debounceTimerRef = useRef(null);
  suggestionsRef.current = [];
  let autocompleteOptions = [];

  const { status, data } = state;

  async function handleInputChange(e) {
    const { value } = e.target;
    setSubreddit(value);
    debouncedSearch();
  }

  if (status === RESOLVED) {
    // TODO: Handle autocomplete state
    console.log(state.data);
    const responseSuggestions = data.map((d) => d.data.display_name);

    if (responseSuggestions != null && responseSuggestions.length > 0) {
      suggestionsRef.current = responseSuggestions;
    }
    autocompleteOptions = suggestionsRef.current;
  }

  const debouncedSearch = debounce(async function search() {
    try {
      await fetchReddit(
        null,
        `https://www.reddit.com/search.json?q=${subreddit}&type=sr`,
      );
    } catch (error) {
      console.log(error);
    }
  }, debounceTimerRef);

  return (
    <>
      <form
        onSubmit={function handleSubmit(e) {
          e.preventDefault();
          if (!subreddit) return;
          autocompleteOptions = [];
          fetchSubreddit(e.target.name.value);
        }}
      >
        <label htmlFor="name">Subreddit:</label>
        <input
          type="text"
          name="name"
          id="name"
          value={subreddit}
          onChange={handleInputChange}
        />
        <button type="submit">Go</button>
      </form>
      {autocompleteOptions.length > 0 && (
        <AutoComplete
          autocompleteOptions={autocompleteOptions}
          setSubreddit={setSubreddit}
          fetchSubreddit={fetchSubreddit}
        />
      )}
    </>
  );
}

export default SearchForm;
