import React, { useEffect, useState } from "react";
import TalentDetailModal from "../Candidates/ReviewCandidates/TalentDetailModal";
import BadgeAplus from "../../../assets/images/badges/aplus.png";
import BadgeA from "../../../assets/images/badges/a.png";
import BadgeBplus from "../../../assets/images/badges/bplus.png";
import BadgeB from "../../../assets/images/badges/b.png";
import BadgeC from "../../../assets/images/badges/c.png";
import BadgeD from "../../../assets/images/badges/d.png";


function TalentManagerView({
  results = [],
  jobTitle,
  jobDescription,
  requiredSkills,
}) {
  const [locationOptions, setLocationOptions] = useState([]);
  const [locationSearchInput, setLocationSearchInput] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("");
  const [shortlistStatus, setShortlistStatus] = useState({});
  const [isShortlisting, setIsShortlisting] = useState({});
  const [selectedTalent, setSelectedTalent] = useState(null);

  const baseUrl = `${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_URL}${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_PORT}`;
  const AIbaseUrl = `${import.meta.env.VITE_SCOUTJAR_AI_BASE_URL}${import.meta.env.VITE_SCOUTJAR_AI_BASE_PORT}`;
  
  useEffect(() => {
    
    fetch(`${baseUrl}/locations/all`)
      .then((res) => res.json())
      .then(setLocationOptions)
      .catch((err) => console.error("Failed to load locations:", err));
  }, []);

  const normalize = (str) => (str || "").toLowerCase().trim();

  const filteredResults = results.filter((profile) => {
    const location = normalize(profile.location);

    const matchesLocation =
      selectedLocations.length === 0 ||
      selectedLocations.some((sel) => {
        const selected = normalize(sel);
        return location.includes(selected) || selected.includes(location);
      });

    const matchesAvailability = availabilityFilter
      ? normalize(profile.availability) === normalize(availabilityFilter)
      : true;

    const matchesWorkMode = workModeFilter
      ? normalize(profile.work_preferences?.work_mode) === normalize(workModeFilter)
      : true;

    return matchesLocation && matchesAvailability && matchesWorkMode;
  });

  const toggleLocation = (value) => {
    setSelectedLocations((prev) =>
      prev.includes(value)
        ? prev.filter((loc) => loc !== value)
        : [...prev, value]
    );
  };

  const handleAiShortlist = async (talentId) => {
    const storedUser = sessionStorage.getItem("sso-login");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const recruiterId = user?.recruiter_id;

    if (!recruiterId) {
      setShortlistStatus((prev) => ({
        ...prev,
        [talentId]: "Recruiter not logged in",
      }));
      return;
    }

    setIsShortlisting((prev) => ({ ...prev, [talentId]: true }));

    try {
      const response = await fetch(`${AIbaseUrl}/ai-shortlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recruiter_id: recruiterId, talent_id: talentId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Shortlisting failed");

      setShortlistStatus((prev) => ({
        ...prev,
        [talentId]: "✅ Added to AI Shortlist",
      }));
    } catch (err) {
      setShortlistStatus((prev) => ({
        ...prev,
        [talentId]: `❌ ${err.message}`,
      }));
    } finally {
      setIsShortlisting((prev) => ({ ...prev, [talentId]: false }));
    }
  };

  /*const getBadgeInfo = (score) => {
    const n = Number(score);
    if (n >= 90) return { badge: "A+", icon: "🚀" };
    if (n >= 70) return { badge: "A", icon: "🔥" };
    if (n >= 50) return { badge: "B+", icon: "⚡" };
    if (n >= 30) return { badge: "B", icon: "💼" };
    if (n >= 20) return { badge: "C", icon: "🧐" };
    return { badge: "D", icon: "🐢" };
  };*/

  const getBadgeInfo = (score) => {
    const n = Number(score);
    if (n >= 90) return { badge: "A+", image: BadgeAplus };
    if (n >= 70) return { badge: "A", image: BadgeA };
    if (n >= 50) return { badge: "B+", image: BadgeBplus };
    if (n >= 30) return { badge: "B", image: BadgeB };
    if (n >= 20) return { badge: "C", image: BadgeC };
    return { badge: "D", image: BadgeD };
  };

  return (
    <div className="p-4 overflow-x-auto">
      <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Talent Manager
      </h3>

      {/* Filters: location, availability, work mode */}
      {/* ... (your filter controls remain unchanged) ... */}
      {/* Filters */}
<div className="flex flex-wrap gap-4 mb-6">
  <div>
    <label className="block font-medium text-sm text-gray-700 mb-1">Location</label>
    <input
      type="text"
      value={locationSearchInput}
      onChange={(e) => setLocationSearchInput(e.target.value)}
      placeholder="Search city/country..."
      className="border border-gray-300 px-3 py-2 rounded w-64"
    />
    <div className="border border-gray-300 p-2 mt-2 max-h-40 overflow-y-scroll rounded bg-white w-64">
      {locationOptions
        .filter((loc) =>
          loc.label.toLowerCase().includes(locationSearchInput.toLowerCase())
        )
        .map((loc, idx) => (
          <label key={idx} className="block mb-1 text-sm">
            <input
              type="checkbox"
              checked={selectedLocations.includes(loc.value)}
              onChange={() => toggleLocation(loc.value)}
              className="mr-2"
            />
            {loc.label}
          </label>
        ))}
    </div>
  </div>

  <div>
    <label className="block font-medium text-sm text-gray-700 mb-1">Availability</label>
    <select
      value={availabilityFilter}
      onChange={(e) => setAvailabilityFilter(e.target.value)}
      className="border border-gray-300 px-3 py-2 rounded"
    >
      <option value="">All</option>
      <option value="Immediate">Immediate</option>
      <option value="Two Weeks Notice">Two Weeks Notice</option>
      <option value="1 Month">1 Month</option>
      <option value="2 Months">2 Months</option>
      <option value="3 Months">3 Months</option>
    </select>
  </div>

  <div>
    <label className="block font-medium text-sm text-gray-700 mb-1">Work Mode</label>
    <select
      value={workModeFilter}
      onChange={(e) => setWorkModeFilter(e.target.value)}
      className="border border-gray-300 px-3 py-2 rounded"
    >
      <option value="">All</option>
      <option value="Remote">Remote</option>
      <option value="On-site">On-site</option>
      <option value="Hybrid">Hybrid</option>
    </select>
  </div>
</div>

      {/* Table */}
      <table className="w-full border-collapse text-sm text-left">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-2">#</th>
            <th className="p-2">Name</th>
            <th className="p-2">Location</th>
            <th className="p-2">Skills</th>
            <th className="p-2">Desired Salary</th>
            <th className="p-2">Work Mode</th>
            <th className="p-2">Availability</th>
            <th className="p-2">Match %</th>
            <th className="p-2">Badge</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
  {filteredResults.map((profile, index) => {
    const { badge, image } = getBadgeInfo(profile.match_score);
    // Conditional background color
    const rowClass = index % 2 === 0 ? 'bg-blue-50' : 'bg-white'; // Light gray for even rows, white for odd

    return (
      <tr
        key={profile.talent_id}
        className={`${rowClass} border-b hover:bg-gray-100 cursor-pointer`} // Adding hover effect for rows
        onClick={() => setSelectedTalent(profile)}
      >
        <td className="p-2 text-gray-500">{index + 1}</td>
        <td className="p-2 font-medium text-gray-800">{profile.full_name}</td>
        {/*<td className="p-2 text-gray-700">{profile.location || "—"}</td>*/}
        <td className="p-2 text-gray-700">
  <div className="flex items-center gap-2">
    {profile.country_code && (
      <img
        src={`https://flagcdn.com/w40/${profile.country_code.toLowerCase().slice(0, 2)}.png`}
        alt={profile.country_code}
        style={{ width: 20, height: 14, borderRadius: "2px", objectFit: "cover" }}
        onError={(e) => { e.target.style.display = 'none'; }} // hide broken flags
      />
    )}
    <span>{profile.location || "—"}</span>
  </div>
</td>

        <td className="p-2 text-gray-700">{profile.skills?.join(", ") || "No Skills"}</td>
        <td className="p-2 text-gray-700">{profile.desired_salary || "N/A"}</td>
        <td className="p-2 text-gray-700">{profile.work_preferences?.work_mode || "N/A"}</td>
        <td className="p-2 text-gray-700">{profile.availability || "N/A"}</td>
        <td className="p-2">
  <span className="text-2xl font-bold text-green-700">
    {Math.round(profile.match_score)}%
  </span>
</td>
        <td className="p-2">
  <div className="flex items-center justify-start gap-2">
    <img
      src={image}
      alt={badge}
      className="w-8 h-8 object-contain"
    />
    <span className="text-xl font-bold text-gray-800">{badge}</span>
  </div>
</td>


        <td className="p-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAiShortlist(profile.talent_id);
            }}
            disabled={isShortlisting[profile.talent_id]}
            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            {isShortlisting[profile.talent_id] ? "..." : "📌 Shortlist"}
          </button>
          {shortlistStatus[profile.talent_id] && (
            <div className="text-xs mt-1 text-blue-600">
              {shortlistStatus[profile.talent_id]}
            </div>
          )}
        </td>
      </tr>
    );
  })}
</tbody>

      </table>

      {filteredResults.length === 0 && (
        <div className="text-center mt-8 text-gray-500">No matching talents found.</div>
      )}

      {/* Modal */}
      {selectedTalent && (
        <TalentDetailModal
          applicant={selectedTalent}
          onClose={() => setSelectedTalent(null)}
          showShortlist={true}
          jobTitle={jobTitle}
          jobDescription={jobDescription}
          requiredSkills={requiredSkills}
        />
      )}
    </div>
  );
}

export default TalentManagerView;
