import { useCallback, useContext, useEffect, useState } from "react";

import AppContext from "../AppContext.js";

export default function Sessions({ authToken }) {
  const [sessions, setSessions] = useState(null);

  const { baseUrl } = useContext(AppContext);

  const [newSession, setNewSession] = useState({
    grade: "",
    division: "",
  });

  const fetchSessions = async () => {
    const response = await fetch(`${baseUrl}/sessions`);
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

    setNewSession({ grade: "", division: "" });

    const response = await fetch(`${baseUrl}/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ grade, division }),
    });
    const data = await response.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    setSessions([...sessions, data.session]);
  };

  const handleRemoveSession = async (id) => {
    await fetch(`${baseUrl}/sessions/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    setSessions(sessions.filter((session) => session._id !== id));
  };

  return (
    <div>
      <h3>Sessions</h3>
      <ul>
        {sessions &&
          sessions.map((session) => (
            <li key={session._id}>
              <p>
                {session.grade} {session.division}
              </p>
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
            type="text"
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
        <button type="submit">Add Session</button>
      </form>
    </div>
  );
}
