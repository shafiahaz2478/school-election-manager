import { useCallback, useContext, useEffect, useState } from "react";

import Header from "../components/Header.jsx";
import VoterInfo from "../components/VoterInfo.jsx";
import Vote from "../components/Vote.jsx";
import Confirmation from "../components/Confirmation.jsx";

import AppContext from "../AppContext.js";

export default function Election() {
  const [activeSession, setActiveSession] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [voteDone, setVoteDone] = useState(false);
  const [voterInfo, setVoterInfo] = useState(null);

  const { baseUrl } = useContext(AppContext);

  const fetchSessions = async () => {
    const res = await fetch(`${baseUrl}/api/sessions`);
    const data = await res.json();

    if (data.error) {
      console.log(data.error);
    } else {
      let found = false;
      for (const session of data.sessions) {
        if (session.isActive) {
          setActiveSession(session);
          found = true;
        }
      }
      if (!found) {
        setActiveSession(null);
      }
    }
  };

  const fetchSessionsCallback = useCallback(fetchSessions, [baseUrl]);
  useEffect(() => {
    fetchSessionsCallback();
  }, [fetchSessionsCallback]);

  const handleVoterInfo = (voterName, voterId) => {
    setVoterInfo({ voterName, voterId });
    setIsVoting(true);
  };

  const handleVoteSubmission = async (votes) => {
    const response = await fetch(`${baseUrl}/api/votes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        voterName: voterInfo.voterName,
        voterId: voterInfo.voterId,
        votes: votes,
        sessionId: activeSession._id,
      }),
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      setIsVoting(false);
      setVoteDone(true);
      fetchSessions();
    }
  };

  return (
    <div>
      <Header />
      <h2>
        Active Session:{" "}
        {activeSession !== null
          ? `${activeSession.grade} ${activeSession.division}`
          : "None"}
      </h2>
      {activeSession !== null &&
        (isVoting ? (
          <Vote submissionHandler={handleVoteSubmission} />
        ) : voteDone ? (
          <Confirmation stopper={() => setVoteDone(false)} timeout={5} />
        ) : (
          <VoterInfo infoHandler={handleVoterInfo} session={activeSession} />
        ))}
    </div>
  );
}
