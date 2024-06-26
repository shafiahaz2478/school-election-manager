import { useContext, useState } from "react";
import AppContext from "../AppContext.js";

export default function VoterInfo({ infoHandler }) {
  const [voterType, setVoterType] = useState("student");
  const [voterName, setVoterName] = useState("");
  const [voterGrade, setVoterGrade] = useState("");
  const [voterSection, setVoterSection] = useState("");
  const [staffPasswordInput, setStaffPasswordInput] = useState("");

  const { staffPassword } = useContext(AppContext);

  return (
    <div>
      <h1>Voter Information</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const isStaff = voterType === "staff";
          if (isStaff) {
            if (staffPasswordInput !== staffPassword) {
              alert("Incorrect staff password. Please contact admin.");
              return;
            }

            infoHandler(voterName, "Staff", voterSection, true);
          } else {
            infoHandler(voterName, voterGrade, voterSection, false);
          }
        }}
      >
        <label>
          Voter Type:
          <select
            defaultValue={"student"}
            onChange={(e) => setVoterType(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="staff">Staff</option>
          </select>
        </label>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={voterName}
            onChange={(e) => setVoterName(e.target.value)}
          />
        </label>
        {voterType === "student" && (
          <label>
            Class:
            <input
              type="text"
              name="grade"
              value={voterGrade}
              onChange={(e) => setVoterGrade(e.target.value)}
            />
          </label>
        )}
        <label>
          {voterType === "student" ? "Section: " : "Staff Section: "}
          <input
            type="text"
            name="section"
            value={voterSection}
            onChange={(e) => setVoterSection(e.target.value)}
          />
        </label>
        {voterType === "staff" && (
          <label>
            Staff Password:
            <input
              type="text"
              name="password"
              value={staffPasswordInput}
              onChange={(e) => setStaffPasswordInput(e.target.value)}
            />
          </label>
        )}
        <button type="submit">Vote</button>
      </form>
    </div>
  );
}
