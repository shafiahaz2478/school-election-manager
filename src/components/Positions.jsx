import { useContext, useState } from "react";
import AppContext from "../contexts/AppContext.js";
import PositionsContext from "../contexts/PositionsContext.jsx";

export default function Positions() {
  const [newPosition, setNewPosition] = useState("");

  const { baseUrl, authToken } = useContext(AppContext);
  const { positions, fetchPositions } = useContext(PositionsContext);

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
      if (data.error) {
        alert(data.error);
      }
      setNewPosition("");
      fetchPositions(); // Update the positions context
    } catch (error) {
      console.error("Error adding position:", error);
    }
  };

  return (
    <div>
      <h2>Positions</h2>
      <ol>
        {positions.map((position) => (
          <li key={position.id} className="position">
            <Position position={position} />
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

function Position({ position }) {
  const { baseUrl, authToken } = useContext(AppContext);
  const { fetchPositions } = useContext(PositionsContext);

  const handleRemovePosition = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/positions/${position.id}`, {
        method: "DELETE",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      }
      fetchPositions(); // Update the positions context
    } catch (error) {
      console.error("Error removing position:", error);
    }
  };

  return (
    <>
      <h3>{position.name}</h3>
      <Candidates position={position} />
      <button onClick={handleRemovePosition}>Remove</button>
    </>
  );
}

function Candidates({ position }) {
  const { baseUrl, authToken } = useContext(AppContext);
  const { fetchPositions } = useContext(PositionsContext);

  const [newCandidate, setNewCandidate] = useState("");
  const [newGrade, setNewGrade] = useState("");
  const [newSection, setNewSection] = useState("");
  const [newImage, setNewImage] = useState(null);

  const handleAddCandidate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", newCandidate);
    formData.append("grade", newGrade);
    formData.append("section", newSection);
    formData.append("positionId", position.id);
    formData.append("image", newImage);

    try {
      const response = await fetch(`${baseUrl}/api/candidates`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      }
      fetchPositions(); // Update the positions context

      setNewCandidate("");
      setNewGrade("");
      setNewSection("");
      setNewImage(null);
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
      if (data.error) {
        alert(data.error);
      }
      fetchPositions(); // Update the positions context
    } catch (error) {
      console.error("Error removing candidate:", error);
    }
  };

  return (
    <div>
      <ul className="candidate-list">
        {position.candidates.map((candidate) => (
          <li key={candidate.id} className="candidate-list-item">
            <img src={candidate.image} alt={candidate.name} />
            <p className="name">{candidate.name}</p>
            <p>
              {candidate.grade} {candidate.section}
            </p>
            <button onClick={() => handleRemoveCandidate(candidate.id)}>
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
        <input
          type="file"
          onChange={(e) => setNewImage(e.target.files[0])}
          required
        />
        <button type="submit">Add Candidate</button>
      </form>
    </div>
  );
}
