import React, { useEffect } from "react";
import Loader from "./components/loader/Loader";
import Post from "./components/post/Post";
import SearchForm from "./components/search-from/SearchForm";
import useSubreddit from "./hooks/useSubreddit";
import { LOADING, REJECTED, RESOLVED } from "./lib/constants";

function App() {
  const [state, fetch] = useSubreddit();

  useEffect(() => {
    fetch();
  }, [fetch]);

  const { status, error, data } = state;

  return (
    <>
      <header className="header">
        <SearchForm fetchSubreddit={fetch} />
      </header>
      <main className="wrapper">
        {status === REJECTED && <p>{JSON.stringify(error, null, 2)}</p>}
        {status === LOADING && <Loader />}
        {status === RESOLVED && (
          <ul className="post-list">
            {data.map(({ data }) => (
              <Post post={data} key={data.id} />
            ))}
          </ul>
        )}
      </main>
    </>
  );
}

export default App;
