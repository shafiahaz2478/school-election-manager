import { createContext, useState, useEffect, useCallback } from "react";

const PositionsContext = createContext();

export const PositionsProvider = ({ children, baseUrl }) => {
  const [positions, setPositions] = useState(null);

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

  return (
    <PositionsContext.Provider
      value={{ positions, setPositions, fetchPositions }}
    >
      {children}
    </PositionsContext.Provider>
  );
};

export default PositionsContext;
