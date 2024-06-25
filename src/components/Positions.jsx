import { useCallback, useContext, useEffect, useState } from "react";
import AppContext from "../AppContext.js";

export default function Positions({ authToken }) {
  const [positions, setPositions] = useState([]);
  const [newPosition, setNewPosition] = useState("");

  const { baseUrl } = useContext(AppContext);

  const fetchPositions = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/positions`);
      const data = await response.json();
      console.log("Fetched positions");
      setPositions(data.positions);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  const fetchPositionsCallback = useCallback(fetchPositions, [baseUrl]);
  useEffect(() => {
    fetchPositionsCallback();
  }, [fetchPositionsCallback]);

  const handleAddPosition = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/api/positions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ name: newPosition }),
      });
      const data = await response.json();
      alert(data.message || data.error);
      setPositions([...positions, data.position]);
      setNewPosition("");
      fetchPositions();
    } catch (error) {
      console.error("Error adding position:", error);
    }
  };

  return (
    <div className="positions">
      <h3>Positions</h3>
      <ol>
        {positions.map((position) => (
          <li key={position._id}>
            <Position
              position={position}
              authToken={authToken}
              fetchPositions={fetchPositions}
            />
          </li>
        ))}
      </ol>
      <form onSubmit={handleAddPosition}>
        <input
          type="text"
          placeholder="Position"
          value={newPosition}
          onChange={(e) => setNewPosition(e.target.value)}
          required
        />
        <button type="submit">Add Position</button>
      </form>
    </div>
  );
}

function Position({ position, authToken, fetchPositions }) {
  const { baseUrl } = useContext(AppContext);

  const handleRemovePosition = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/positions/${position._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      alert(data.message || data.error);
      fetchPositions();
    } catch (error) {
      console.error("Error removing position:", error);
    }
  };

  return (
    <>
      <h3>{position.name}</h3>
      <Candidates position={position} authToken={authToken} />
      <button onClick={() => handleRemovePosition(position._id)}>Remove</button>
    </>
  );
}

function Candidates({ position, authToken }) {
  const { baseUrl } = useContext(AppContext);

  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState("");

  const fetchCandidates = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/candidates`);
      const data = await response.json();
      console.log("Fetched candidates");
      setCandidates(
        data.candidates.filter(
          (candidate) => candidate.position._id === position._id,
        ),
      );
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const fetchCandidatesCallback = useCallback(fetchCandidates, [
    baseUrl,
    position._id,
  ]);
  useEffect(() => {
    fetchCandidatesCallback();
  }, [fetchCandidatesCallback]);

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/api/candidates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ name: newCandidate, positionId: position._id }),
      });
      const data = await response.json();
      alert(data.message || data.error);
      fetchCandidates();
      setNewCandidate("");
    } catch (error) {
      console.error("Error adding candidate:", error);
    }
  };

  const handleRemoveCandidate = async (candidateId) => {
    try {
      const response = await fetch(`${baseUrl}/api/candidates/${candidateId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      alert(data.message || data.error);
      fetchCandidates();
    } catch (error) {
      console.error("Error removing candidate:", error);
    }
  };

  return (
    <>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate._id}>
            <p>{candidate.name}</p>
            <button onClick={() => handleRemoveCandidate(candidate._id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddCandidate}>
        <input
          type="text"
          placeholder="Candidate"
          value={newCandidate}
          onChange={(e) => setNewCandidate(e.target.value)}
          required
        />
        <button type="submit">Add Candidate</button>
      </form>
    </>
  );
}
