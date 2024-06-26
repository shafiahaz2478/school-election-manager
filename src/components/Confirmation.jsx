import { useEffect } from "react";

export default function Confirmation({ timeout, stopper }) {
  useEffect(() => {
    setTimeout(() => stopper(), timeout * 1000);
  }, [timeout, stopper]);

  return (
    <div>
      <h1>Vote done</h1>
    </div>
  );
}
