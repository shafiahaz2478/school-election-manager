import { useCallback, useContext, useEffect, useState } from "react";

import AppContext from "../AppContext.js";

export default function Vote({ submissionHandler }) {
  const { baseUrl } = useContext(AppContext);

  const [positions, setPositions] = useState(null);
  const [isDraft, setIsDraft] = useState(true);

  const fetchPositions = async () => {
    const positionResponse = await fetch(`${baseUrl}/api/positions`);
    const positionsData = await positionResponse.json();
    if (positionsData.error) {
      alert("Could not fetch positions");
      return;
    }

    const candidateResponse = await fetch(`${baseUrl}/api/candidates`);
    const candidatesData = await candidateResponse.json();
    if (candidatesData.error) {
      alert("Could not fetch candidates");
      return;
    }

    setPositions(
      positionsData.positions.map((position) => ({
        id: position._id,
        name: position.name,
        candidates: candidatesData.candidates
          .filter((candidate) => candidate.position._id === position._id)
          .map((candidate) => ({
            id: candidate._id,
            name: candidate.name,
            grade: candidate.grade,
            division: candidate.division,
            chosen: false,
          })),
        chosenCandidate: null,
      })),
    );
  };

  const fetchPositionsCallback = useCallback(fetchPositions, [baseUrl]);
  useEffect(() => {
    fetchPositionsCallback();
  }, [fetchPositionsCallback]);

  const handleCandidateChoice = (choicePosition, choiceCandidate) => {
    for (const position of positions) {
      if (position.id === choicePosition.id) {
        for (const candidate of position.candidates) {
          candidate.chosen = false;
        }
        choiceCandidate.chosen = true;
      }
    }
  };

  const handleDraftSubmission = (e) => {
    e.preventDefault();
    for (const position of positions) {
      let chosen = false;
      for (const candidate of position.candidates) {
        if (candidate.chosen) {
          chosen = true;
          position.chosenCandidate = candidate;
        }
      }
      if (!chosen) {
        alert("Please vote for at least one candidate in all positions");
        return;
      }
    }
    setIsDraft(false);
  };

  const handleVoteConfirmation = (e) => {
    e.preventDefault();
    const votes = positions.map((position) => ({
      positionId: position.id,
      candidateId: position.chosenCandidate.id,
    }));
    setIsDraft(false);

    submissionHandler(votes);
  };

  return isDraft ? (
    <form className="vote-draft">
      <div>
        {positions &&
          positions.map((position) => (
            <ul key={position.id} className="candidate-vote-list">
              <h2>{position.name}</h2>
              {position.candidates.map((candidate) => (
                <button
                  key={candidate.id}
                  type="button"
                  className={`vote-list-candidate ${candidate.chosen ? "chosen-candidate" : "unchosen-candidate"}`}
                  onClick={() => handleCandidateChoice(position, candidate)}
                >
                  <h3>{candidate.name}</h3>
                  <p>
                    {candidate.grade} {candidate.division}
                  </p>
                </button>
              ))}
            </ul>
          ))}
      </div>
      <button type="button" onClick={handleDraftSubmission}>
        Submit
      </button>
    </form>
  ) : (
    <form className="vote-confirm" onSubmit={handleVoteConfirmation}>
      <h1>Confirm Vote</h1>
      <ol className="vote-confirm-list">
        {positions &&
          positions.map((position) => (
            <li key={position.id}>
              <p>
                <strong>{position.name}</strong>:
              </p>{" "}
              <p>
                {position.chosenCandidate.name},{" "}
                {position.chosenCandidate.grade}{" "}
                {position.chosenCandidate.division}
              </p>
            </li>
          ))}
      </ol>
      <button type="submit">Confirm</button>
    </form>
  );
}
