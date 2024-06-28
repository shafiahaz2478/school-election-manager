import { useEffect } from "react";

export default function Confirmation({ timeout, stopper }) {
  useEffect(() => {
    setTimeout(() => stopper(), timeout * 1000);
  }, [timeout, stopper]);

  return (
    <div className="thank-you">
      <h1 className="container-title">THANK YOU</h1>
      <h2>for your valuable vote!</h2>
      <img src="/voting.gif" alt="Person voting" />
      <div className="quote">
        <blockquote>
          If your actions inspire others to dream more, learn more, do more and
          become more, you are a leader.
        </blockquote>
      </div>
      <div className="timer-gauge"></div>
    </div>
  );
}
