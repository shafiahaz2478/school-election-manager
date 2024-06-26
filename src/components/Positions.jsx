import { useCallback, useContext, useEffect, useState } from "react";
import AppContext from "../AppContext.js";

export default function Positions() {
  const [positions, setPositions] = useState([]);
  const [newPosition, setNewPosition] = useState("");

  const { baseUrl, authToken } = useContext(AppContext);

  const fetchPositions = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/positions`, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
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
          "ngrok-skip-browser-warning": "true",
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
            <Position position={position} fetchPositions={fetchPositions} />
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

function Position({ position, fetchPositions }) {
  const { baseUrl, authToken } = useContext(AppContext);

  const handleRemovePosition = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/positions/${position._id}`, {
        method: "DELETE",
        headers: {
          "ngrok-skip-browser-warning": "true",
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
      <Candidates position={position} />
      <button onClick={() => handleRemovePosition(position._id)}>Remove</button>
    </>
  );
}

function Candidates({ position }) {
  const { baseUrl, authToken } = useContext(AppContext);

  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState("");
  const [newGrade, setNewGrade] = useState("");
  const [newSection, setNewSection] = useState("");

  const fetchCandidates = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/candidates`, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
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
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: newCandidate,
          grade: newGrade,
          section: newSection,
          positionId: position._id,
        }),
      });
      const data = await response.json();
      alert(data.message || data.error);
      fetchCandidates();

      setNewCandidate("");
      setNewGrade("");
      setNewSection("");
    } catch (error) {
      console.error("Error adding candidate:", error);
    }
  };

  const handleRemoveCandidate = async (candidateId) => {
    try {
      const response = await fetch(`${baseUrl}/api/candidates/${candidateId}`, {
        method: "DELETE",
        headers: {
          "ngrok-skip-browser-warning": "true",
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
            <p>
              {candidate.name}, {candidate.grade} {candidate.section}
            </p>
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
        <input
          type="number"
          min="0"
          max="12"
          placeholder="Grade"
          value={newGrade}
          onChange={(e) => setNewGrade(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Section"
          value={newSection}
          onChange={(e) => setNewSection(e.target.value)}
          required
        />
        <button type="submit">Add Candidate</button>
      </form>
    </>
  );
}
