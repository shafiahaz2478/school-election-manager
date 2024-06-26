import { useContext, useState } from "react";
import PositionsContext from "../contexts/PositionsContext.jsx";

export default function Vote({ submissionHandler }) {
  const { positions, setPositions } = useContext(PositionsContext);

  const [isDraft, setIsDraft] = useState(true);

  const handleCandidateChoice = (choicePosition, choiceCandidate) => {
    setPositions((prevPositions) =>
      prevPositions.map((position) => {
        if (position.id === choicePosition.id) {
          return {
            ...position,
            candidates: position.candidates.map((candidate) => ({
              ...candidate,
              chosen: candidate.id === choiceCandidate.id,
            })),
          };
        }
        return position;
      }),
    );
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
                  <img src={candidate.image} alt={candidate.name} />
                  <h3>{candidate.name}</h3>
                  <p>
                    {candidate.grade} {candidate.section}
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
              </p>
              <img
                src={position.chosenCandidate.image}
                alt={position.chosenCandidate.name}
              />
              <p>
                {position.chosenCandidate.name},{" "}
                {position.chosenCandidate.grade}{" "}
                {position.chosenCandidate.section}
              </p>
            </li>
          ))}
      </ol>
      <button type="button" onClick={() => setIsDraft(true)}>
        Change Votes
      </button>
      <button type="submit">Confirm</button>
    </form>
  );
}
