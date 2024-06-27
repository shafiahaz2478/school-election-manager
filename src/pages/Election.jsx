import { useContext, useState } from "react";

import VoterInfo from "../components/VoterInfo.jsx";
import Vote from "../components/Vote.jsx";
import Confirmation from "../components/Confirmation.jsx";

import AppContext from "../contexts/AppContext.js";
import Container from "../components/Container.jsx";

import "../styles/Election.css";

export default function Election() {
  const [isVoting, setIsVoting] = useState(false);
  const [voteDone, setVoteDone] = useState(false);
  const [voterInfo, setVoterInfo] = useState(null);

  const { baseUrl } = useContext(AppContext);

  const handleVoterInfo = (
    voterName,
    voterGrade,
    voterSection,
    isStaff = false,
  ) => {
    setVoterInfo({
      name: voterName,
      grade: voterGrade,
      section: voterSection,
      isStaff,
    });
    setIsVoting(true);
  };

  const handleVoteSubmission = async (votes) => {
    const response = await fetch(`${baseUrl}/api/votes`, {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        voterInfo,
        votes,
      }),
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      setIsVoting(false);
      setVoteDone(true);
    }
  };

  return (
    <Container
      child={
        <div className="container">
          {isVoting ? (
            <Vote submissionHandler={handleVoteSubmission} />
          ) : voteDone ? (
            <Confirmation stopper={() => setVoteDone(false)} timeout={5} />
          ) : (
            <VoterInfo infoHandler={handleVoterInfo} />
          )}
        </div>
      }
    />
  );
}
