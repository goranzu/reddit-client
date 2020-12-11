import React, { useRef, useState } from "react";
import useSubreddit from "../../hooks/useSubreddit";
import { debounce } from "../../lib/util";
import AutoComplete from "../autocomplete/Autocomplete";
import styles from "./search-form.module.css";
import { ReactComponent as SearchIcon } from "../../assets/icons/search.svg";
import { useHistory } from "react-router-dom";

function SearchForm() {
  // TODO: FIX focus issues
  const [subreddit, setSubreddit] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [state, fetch, reset] = useSubreddit();
  const timerRef = useRef();
  let history = useHistory();

  const search = debounce(async function search() {
    fetch(
      undefined,
      `https://www.reddit.com/search.json?q=${subreddit}&type=sr`,
    );
    setShowAutocomplete(true);
  }, timerRef);

  let options = state.data.map((o) => {
    return o.data.display_name;
  });

  async function handleInputChange(e) {
    const { value } = e.target;
    setSubreddit(value);
    search();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!subreddit) return;
    reset();
    history.push(`/r/${subreddit}`);
    setShowAutocomplete(false);
    reset();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="name">
        Search for a subreddit:
      </label>
      <input
        type="text"
        name="name"
        id="name"
        value={subreddit}
        onChange={handleInputChange}
        placeholder="Search"
      />
      <SearchIcon />
      {options.length > 0 && showAutocomplete && (
        <AutoComplete
          autocompleteOptions={options}
          setSubreddit={setSubreddit}
          reset={reset}
          setShowAutocomplete={setShowAutocomplete}
        />
      )}
    </form>
  );
}

export default SearchForm;
