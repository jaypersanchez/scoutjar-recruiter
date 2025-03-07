import React from "react";
import "@/common/styles/App.css";

function TalentSidebar({ setSelectedSection }) {
  return (
    <aside className="recruiter-sidebar">
      <ul>
        {["Search for Job", "Apply for Job"].map((item) => (
          <li key={item}>
            <button
              className="sidebar-button"
              onClick={() => setSelectedSection(item)}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default TalentSidebar;
