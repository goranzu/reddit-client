import React, { useRef, useState } from "react";
import useSubreddit from "../../hooks/useSubreddit";
import { debounce } from "../../lib/util";
import AutoComplete from "../autocomplete/Autocomplete";
import styles from "./search-form.module.css";
import { ReactComponent as SearchIcon } from "../../assets/icons/search.svg";

function SearchForm({ fetchSubreddit }) {
  const [subreddit, setSubreddit] = useState("");
  const [state, fetch, reset] = useSubreddit();
  const timerRef = useRef();

  const search = debounce(async function search() {
    fetch(
      undefined,
      `https://www.reddit.com/search.json?q=${subreddit}&type=sr`,
    );
  }, timerRef);

  const options = state.data.map((o) => {
    return o.data.display_name;
  });

  async function handleInputChange(e) {
    const { value } = e.target;
    setSubreddit(value);
    search();
  }

  return (
    <form
      className={styles.form}
      onSubmit={function handleSubmit(e) {
        e.preventDefault();
        if (!subreddit) return;
        reset();
        fetchSubreddit(e.target.name.value);
      }}
    >
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
      {options.length > 0 && (
        <AutoComplete
          autocompleteOptions={options}
          setSubreddit={setSubreddit}
          fetchSubreddit={fetchSubreddit}
          reset={reset}
        />
      )}
    </form>
  );
}

export default SearchForm;
