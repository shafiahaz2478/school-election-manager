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

    for (const position of positions) {
      for (const candidate of position.candidates) {
        candidate.chosen = false;
      }
      position.chosenCandidate = null;
    }
    submissionHandler(votes);
  };

  return isDraft ? (
    <form className="vote-draft">
      <h1 className="container-title">Vote for your candidates</h1>
      <div className="positions">
        {positions &&
          positions.map((position) => (
            <ul key={position.id} className="candidate-vote-list">
              <h2 className="position-title">{position.name}</h2>
              <div>
                {position.candidates.map((candidate) => (
                  <button
                    key={candidate.id}
                    type="button"
                    className={`vote-list-candidate ${candidate.chosen ? "chosen-candidate" : "unchosen-candidate"}`}
                    onClick={() => handleCandidateChoice(position, candidate)}
                  >
                    <img src={candidate.image} alt={candidate.name} />
                    <h3 className="vote-list-candidate-name">
                      {candidate.name}
                    </h3>
                    <p className="vote-list-candidate-info">
                      {candidate.grade} {candidate.section}
                    </p>
                  </button>
                ))}
              </div>
            </ul>
          ))}
      </div>
      <button
        type="button"
        className="submit-draft"
        onClick={handleDraftSubmission}
      >
        Submit
      </button>
    </form>
  ) : (
    <form className="vote-confirm" onSubmit={handleVoteConfirmation}>
      <h1 className="container-title">Confirm Vote</h1>
      <ul className="vote-confirm-list">
        {positions &&
          positions.map((position) => (
            <li key={position.id} className="vote-confirm-list-item">
              <img
                className="candidate-image"
                src={position.chosenCandidate.image}
                alt={position.chosenCandidate.name}
              />
              <strong className="candidate-position">{position.name}</strong>
              <div className="candidate">
                <p className="candidate-name">
                  {position.chosenCandidate.name}
                </p>
                <p className="candidate-info">
                  {position.chosenCandidate.grade}{" "}
                  {position.chosenCandidate.section}
                </p>
              </div>
            </li>
          ))}
      </ul>
      <div className="confirm-actions">
        <button
          type="button"
          className="change-votes"
          onClick={() => setIsDraft(true)}
        >
          Change Votes
        </button>
        <button type="submit" className="confirm-votes">
          Confirm
        </button>
      </div>
    </form>
  );
}
