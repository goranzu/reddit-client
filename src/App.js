import { useEffect, useReducer, useRef, useState } from "react";
import Loader from "./components/loader/Loader";

const LOADING = "loading";
const IDLE = "idle";
const RESOLVED = "resolved";
const REJECTED = "rejected";

const initialState = {
  data: [],
  status: IDLE,
  error: "",
};

function wait(ms = 500) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

function reducer(state, action) {
  switch (action.type) {
    case LOADING:
      return { ...state, status: LOADING };
    case RESOLVED:
      return { ...state, status: RESOLVED, data: action.payload.data };
    case REJECTED:
      return { ...state, status: REJECTED, error: action.payload.error };
    default:
      return { ...state };
  }
}

async function apiClient(url) {
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });
  const data = await response.json();
  if (response.ok) return data;

  const error = new Error(data.message || "Failed fetching data");
  error.response = data;
  throw error;
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [subreddit, setSubreddit] = useState("");
  const [autocomplete, setAutocomplete] = useState([]);
  const suggestionsRef = useRef(null);
  suggestionsRef.current = [];
  const debounceTimerRef = useRef(null);

  async function fetchData(subreddit = "all") {
    try {
      dispatch({ type: LOADING });
      const response = await apiClient(
        `https://www.reddit.com/r/${subreddit}.json`,
      );
      await wait();
      dispatch({
        type: RESOLVED,
        payload: { data: response?.data?.children },
      });
    } catch (error) {
      dispatch({ type: REJECTED, payload: { error: error.message } });
    }
  }

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  function isImage(url) {
    return url.match(/jpg$|png$|jpeg$|gif$|webp$/g);
  }

  function renderVideoTag(media) {
    const url = media.scrubber_media_url;
    const format = url.split(".").pop();
    return (
      <video height={media.height} width={media.width} controls muted autoPlay>
        <source src={url} type={`video/${format}`} />
      </video>
    );
  }

  const debouncedSearch = debounce(async function () {
    const response = await fetch(
      `https://www.reddit.com/search.json?q=${subreddit}&type=sr`,
    );
    const data = await response.json();
    const responseSuggestions = data?.data?.children.map(
      (d) => d.data.display_name,
    );

    if (responseSuggestions != null) {
      suggestionsRef.current = responseSuggestions;
    }

    let result = [];
    for (const suggestion of suggestionsRef.current) {
      if (suggestion.startsWith(subreddit) && subreddit !== "") {
        result.push(suggestion);
      }
    }
    setAutocomplete(suggestionsRef.current);
  });

  function debounce(cb) {
    return function () {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        cb();
      }, 1000);
    };
  }

  async function handleInputChange(e) {
    const { value } = e.target;
    setSubreddit(value);
    debouncedSearch();
  }

  const { status, error, data } = state;

  // console.log(data);
  // console.log(status);
  // console.log(suggestions);
  return (
    <main className="wrapper">
      <h1>Reddit Client</h1>
      <p>Most popular posts of the day.</p>
      <form
        onSubmit={function handleSubmit(e) {
          e.preventDefault();
          if (!subreddit) return;
        }}
      >
        <label htmlFor="name">Subreddit name:</label>
        <input
          type="text"
          name="name"
          id="name"
          value={subreddit}
          onChange={handleInputChange}
        />
        {autocomplete.length > 0 && (
          <ul>
            {autocomplete.map((c) => (
              <li key={c}>
                <button
                  onClick={function handleAutoCompleteClick(e) {
                    setAutocomplete([]);
                    fetchData(c);
                  }}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
        )}
        <button type="submit">Go</button>
      </form>
      {status === REJECTED && <p>{JSON.stringify(error, null, 2)}</p>}
      {status === LOADING && <Loader />}
      {status === RESOLVED && (
        <ul className="card-list">
          {data.map(({ data }, index) => (
            <li key={data.id} className="card">
              {data.is_video && renderVideoTag(data.media.reddit_video)}
              <p>{index}</p>
              {isImage(data.url) && <img src={data.url} alt={data.title} />}
              <h2>{data.title}</h2>
              <a href={`https://www.reddit.com${data.permalink}`}>comments</a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;
