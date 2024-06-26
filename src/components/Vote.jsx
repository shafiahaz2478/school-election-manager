import { useCallback, useContext, useEffect, useState } from "react";

import AppContext from "../AppContext.js";

export default function Vote({ submissionHandler }) {
  const { baseUrl } = useContext(AppContext);

  const [positions, setPositions] = useState(null);
  const [isDraft, setIsDraft] = useState(true);

  const fetchImage = useCallback(
    async (id) => {
      const response = await fetch(`${baseUrl}/api/candidates/${id}/image`, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      const imageBlob = await response.blob();
      const imageObjectURL = URL.createObjectURL(imageBlob);
      return imageObjectURL;
    },
    [baseUrl],
  );

  const fetchPositions = useCallback(async () => {
    try {
      const positionResponse = await fetch(`${baseUrl}/api/positions`, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      const positionsData = await positionResponse.json();
      if (positionsData.error) {
        alert("Could not fetch positions");
        return;
      }

      const candidateResponse = await fetch(`${baseUrl}/api/candidates`, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      const candidatesData = await candidateResponse.json();
      if (candidatesData.error) {
        alert("Could not fetch candidates");
        return;
      }

      const positionsWithCandidates = await Promise.all(
        positionsData.positions.map(async (position) => {
          const candidatesWithImages = await Promise.all(
            candidatesData.candidates
              .filter((candidate) => candidate.position._id === position._id)
              .map(async (candidate) => ({
                id: candidate._id,
                name: candidate.name,
                grade: candidate.grade,
                section: candidate.section,
                image: await fetchImage(candidate._id),
                chosen: false,
              })),
          );
          return {
            id: position._id,
            name: position.name,
            candidates: candidatesWithImages,
            chosenCandidate: null,
          };
        }),
      );

      setPositions(positionsWithCandidates);
    } catch (error) {
      console.error("Error fetching positions or candidates:", error);
    }
  }, [baseUrl, fetchImage]);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

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
