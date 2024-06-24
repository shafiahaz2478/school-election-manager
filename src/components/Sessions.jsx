import { useCallback, useEffect, useState } from "react";

export default function Sessions({ baseUrl, authToken }) {
  const [sessions, setSessions] = useState(null);

  const [newSession, setNewSession] = useState({
    grade: "",
    division: "",
  });

  const fetchSessions = async () => {
    const response = await fetch(`${baseUrl}/sessions`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const data = await response.json();
    setSessions(data.sessions);
    console.log(data.sessions);
  };

  const fetchSessionsCallback = useCallback(fetchSessions, [
    baseUrl,
    authToken,
  ]);
  useEffect(() => {
    fetchSessionsCallback();
  }, [fetchSessionsCallback]);

  const handleAddSession = async (e) => {
    e.preventDefault();
    const grade = e.target.grade.value;
    const division = e.target.division.value;
    const response = await fetch(`${baseUrl}/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ grade, division }),
    });
    const data = await response.json();
    setSessions([...sessions, data.session]);
    setNewSession({ grade: "", division: "" });
    console.log(data.session);
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
