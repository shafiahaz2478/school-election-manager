import { useCallback, useContext, useEffect, useState } from "react";
import AppContext from "../AppContext.js";

export default function Results() {
  const { baseUrl, authToken } = useContext(AppContext);

  const [results, setResults] = useState({
    studentResults: [],
    staffResults: [],
  });

  const fetchResults = async () => {
    const response = await fetch(`${baseUrl}/api/votes/results`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    const data = await response.json();
    setResults({
      studentResults: data.studentResults,
      staffResults: data.staffResults,
    });
  };

  const fetchResultsCallback = useCallback(fetchResults, [baseUrl, authToken]);

  useEffect(() => {
    fetchResultsCallback();
  }, [fetchResultsCallback]);

  const renderResults = (title, results) => {
    const groupedResults = results.reduce((acc, result) => {
      const position = result.position;
      if (!acc[position]) acc[position] = [];
      acc[position].push(result);
      return acc;
    }, {});

    return (
      <div>
        <h3>{title}</h3>
        {results.length === 0 && <p>No results available</p>}
        {Object.entries(groupedResults).map(([position, candidates]) => (
          <div key={position}>
            <h4>{position}</h4>
            <ul>
              {candidates.map((candidate) => (
                <li key={candidate._id.candidate}>
                  {candidate.candidate}: {candidate.totalVotes} votes
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2>Results</h2>
      {renderResults("Student Votes", results.studentResults)}
      {renderResults("Staff Votes", results.staffResults)}
    </div>
  );
}
