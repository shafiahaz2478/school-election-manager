import { useCallback, useContext, useEffect, useState } from "react";

import AppContext from "../AppContext.js";

export default function Results() {
  const { baseUrl, authToken } = useContext(AppContext);

  const [results, setResults] = useState(null);

  const fetchResults = async () => {
    const response = await fetch(`${baseUrl}/api/votes/results`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    const data = await response.json();
    setResults(data.results);
  };

  const fetchResultsCallback = useCallback(fetchResults, [baseUrl, authToken]);
  useEffect(() => {
    fetchResultsCallback();
  }, [fetchResultsCallback]);

  return (
    <div>
      <h2>Results</h2>
      <ul>
        {results !== null &&
          results.map((result) => (
            <li key={result._id.candidate}>
              {result.candidate} [{result.position}]: {result.totalVotes} votes
            </li>
          ))}
      </ul>
    </div>
  );
}
