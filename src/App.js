import { useEffect, useReducer } from "react";
import "./App.css";

const LOADING = "loading";
const IDLE = "idle";
const RESOLVED = "resolved";
const REJECTED = "rejected";

const initialState = {
  data: [],
  status: IDLE,
  error: "",
};

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

  useEffect(() => {
    (async function fetchData() {
      try {
        const response = await apiClient("https://www.reddit.com/r/all.json");
        dispatch({
          type: RESOLVED,
          payload: { data: response?.data?.children },
        });
      } catch (error) {
        dispatch({ type: REJECTED, payload: { error: error.message } });
      }
    })();
  }, [dispatch]);

  const { status, error, data } = state;

  console.log(data);
  return (
    <div>
      <h1>Reddit Client</h1>
      <p>Most popular posts of the day.</p>
      {status === REJECTED && <p>{JSON.stringify(error, null, 2)}</p>}
      {status === LOADING && <p>Loading...</p>}
      {status === RESOLVED && (
        <ul>
          {data.map(({ data }) => (
            <li key={data.id}>
              <h2>{data.title}</h2>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
