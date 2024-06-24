import { useCallback, useEffect, useState } from "react";

export default function Positions({ baseUrl, authToken }) {
  const [positions, setPositions] = useState([]);
  const [newPosition, setNewPosition] = useState("");

  const fetchPositions = async () => {
    try {
      const response = await fetch(`${baseUrl}/positions`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await response.json();
      console.log("Fetched positions");
      setPositions(data.positions);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  const fetchPositionsCallback = useCallback(fetchPositions, [
    baseUrl,
    authToken,
  ]);
  useEffect(() => {
    fetchPositionsCallback();
  }, [fetchPositionsCallback]);

  const handleAddPosition = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/positions`, {
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
              baseUrl={baseUrl}
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

function Position({ position, baseUrl, authToken, fetchPositions }) {
  const handleRemovePosition = async () => {
    try {
      const response = await fetch(`${baseUrl}/positions/${position._id}`, {
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
      <Candidates position={position} baseUrl={baseUrl} authToken={authToken} />
      <button onClick={() => handleRemovePosition(position._id)}>Remove</button>
    </>
  );
}

function Candidates({ position, baseUrl, authToken }) {
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState("");

  const fetchCandidates = async () => {
    try {
      const response = await fetch(`${baseUrl}/candidates`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
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
    authToken,
    position._id,
  ]);
  useEffect(() => {
    fetchCandidatesCallback();
  }, [fetchCandidatesCallback]);

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/candidates`, {
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
      const response = await fetch(`${baseUrl}/candidates/${candidateId}`, {
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
