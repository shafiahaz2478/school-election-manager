import { useCallback, useContext, useEffect, useState } from "react";

import AppContext from "../AppContext.js";

export default function Sessions() {
  const [sessions, setSessions] = useState(null);

  const { baseUrl, authToken } = useContext(AppContext);

  const [newSession, setNewSession] = useState({
    grade: "",
    division: "",
    voters: "",
  });

  const fetchSessions = async () => {
    const response = await fetch(`${baseUrl}/api/sessions`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    const data = await response.json();
    setSessions(data.sessions);
  };

  const fetchSessionsCallback = useCallback(fetchSessions, [baseUrl]);
  useEffect(() => {
    fetchSessionsCallback();
  }, [fetchSessionsCallback]);

  const handleAddSession = async (e) => {
    e.preventDefault();
    const grade = e.target.grade.value;
    const division = e.target.division.value;
    const voters = e.target.voters.value;

    setNewSession({ grade: "", division: "", voters: "" });

    const response = await fetch(`${baseUrl}/api/sessions`, {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ grade, division, voters }),
    });
    const data = await response.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    setSessions([...sessions, data.session]);
  };

  const handleRemoveSession = async (id) => {
    await fetch(`${baseUrl}/api/sessions/${id}`, {
      method: "DELETE",
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${authToken}`,
      },
    });
    setSessions(sessions.filter((session) => session._id !== id));
  };

  const handleStartSession = async (id) => {
    const session = sessions.find((session) => session._id === id);
    const updatedSession = {
      ...session,
      isActive: true,
    };

    const response = await fetch(`${baseUrl}/api/sessions/${id}`, {
      method: "PUT",
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedSession),
    });
    const data = await response.json();

    if (data.error) {
      alert(data.error);
    } else {
      sessions[sessions.findIndex((s) => s._id === id)] = updatedSession;
      setSessions([...sessions]);
    }
  };

  const handleStopSession = async (id) => {
    const session = sessions.find((session) => session._id === id);
    const updatedSession = {
      ...session,
      isActive: false,
    };

    const response = await fetch(`${baseUrl}/api/sessions/${id}`, {
      method: "PUT",
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedSession),
    });
    const data = await response.json();

    if (data.error) {
      alert(data.error);
    } else {
      sessions[sessions.findIndex((s) => s._id === id)] = updatedSession;
      setSessions([...sessions]);
    }
  };

  return (
    <div>
      <h3>Sessions</h3>
      <ul>
        {sessions &&
          sessions.map((session) => (
            <li key={session._id}>
              <p>
                {session.grade} {session.division} [{session.voters}]{" "}
                {session.isActive && "[Active]"}
              </p>
              <button onClick={() => handleStartSession(session._id)}>
                Start
              </button>
              <button onClick={() => handleStopSession(session._id)}>
                Stop
              </button>
              <button onClick={() => handleRemoveSession(session._id)}>
                Remove
              </button>
            </li>
          ))}
      </ul>
      <form onSubmit={handleAddSession}>
        <label>
          Grade:
          <input
            type="number"
            min="-1"
            max="12"
            name="grade"
            value={newSession.grade}
            onChange={(e) =>
              setNewSession({ ...newSession, grade: e.target.value })
            }
          />
        </label>
        <label>
          Division:
          <input
            type="text"
            name="division"
            value={newSession.division}
            onChange={(e) =>
              setNewSession({ ...newSession, division: e.target.value })
            }
          />
        </label>
        <label>
          Voters:
          <input
            type="number"
            name="voters"
            value={newSession.voters}
            onChange={(e) =>
              setNewSession({ ...newSession, voters: e.target.value })
            }
          />
        </label>
        <button type="submit">Add Session</button>
      </form>
    </div>
  );
}
