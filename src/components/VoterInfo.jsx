import { useState } from "react";

export default function VoterInfo({ infoHandler, session }) {
  const [voterName, setVoterName] = useState("");
  const [voterId, setVoterId] = useState("");

  return (
    <div>
      <h1>Voter Information</h1>
      <form onSubmit={() => infoHandler(voterName, voterId)}>
        <div>
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            id="name"
            name="name"
            value={voterName}
            onChange={(e) => setVoterName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="id">Roll No.: </label>
          <input
            type="number"
            min="1"
            max={session.voters}
            id="id"
            name="id"
            value={voterId}
            onChange={(e) => setVoterId(e.target.value)}
          />
        </div>
        <button type="submit">Vote</button>
      </form>
    </div>
  );
}
