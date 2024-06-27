import { useContext, useState } from "react";
import AppContext from "../contexts/AppContext.js";

export default function VoterInfo({ infoHandler }) {
  const [voterType, setVoterType] = useState("student");
  const [voterName, setVoterName] = useState("");
  const [voterGrade, setVoterGrade] = useState("");
  const [voterSection, setVoterSection] = useState("");
  const [staffPasswordInput, setStaffPasswordInput] = useState("");

  const { staffPassword } = useContext(AppContext);

  const staffSections = [
    "Foundation",
    "Preparatory",
    "Middle School",
    "Secondary",
  ];

  return (
    <div className="voter-info">
      <h1 className="container-title">Voter Information</h1>
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
        <div className="voter-type">
          <button
            type="button"
            onClick={() => {
              setVoterType("student");
              if (staffSections.includes(voterSection)) {
                setVoterSection("");
              }
            }}
          >
            <div
              className={
                "voter-type-slider" + (voterType === "staff" ? " staff" : "")
              }
            ></div>
            <p>Student</p>
          </button>
          <button
            type="button"
            onClick={() => {
              setVoterType("staff");
              if (!staffSections.includes(voterSection)) {
                setVoterSection(staffSections[0]);
              }
            }}
          >
            <p>Staff</p>
          </button>
        </div>
        <label>
          <strong>Name</strong>
          <input
            type="text"
            name="name"
            autoComplete="off"
            value={voterName}
            onChange={(e) => setVoterName(e.target.value)}
            required
          />
        </label>
        {voterType === "student" && (
          <label>
            <strong>Class</strong>
            <input
              type="number"
              name="grade"
              autoComplete="off"
              value={voterGrade}
              onChange={(e) => setVoterGrade(e.target.value)}
              required
            />
          </label>
        )}
        <label>
          <strong>Section</strong>
          {voterType === "student" ? (
            <input
              type="text"
              name="section"
              autoComplete="off"
              value={voterSection}
              onChange={(e) => setVoterSection(e.target.value)}
              required
            />
          ) : (
            <select
              value={voterSection}
              onChange={(e) => setVoterSection(e.target.value)}
            >
              {staffSections.map((section) => (
                <option key={section} value={section}>
                  {section} Level
                </option>
              ))}
            </select>
          )}
        </label>
        {voterType === "staff" && (
          <label>
            <strong>Staff Password</strong>
            <input
              type="password"
              name="password"
              value={staffPasswordInput}
              onChange={(e) => setStaffPasswordInput(e.target.value)}
              required
            />
          </label>
        )}
        <button type="submit" className="info-submit">
          Vote
        </button>
      </form>
    </div>
  );
}
