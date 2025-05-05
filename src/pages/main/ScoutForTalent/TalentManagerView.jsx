import React, { useEffect, useState } from "react";

function TalentManagerView({ results = [] }) {
  const [locationOptions, setLocationOptions] = useState([]);
  const [locationSearchInput, setLocationSearchInput] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("");
  const [shortlistStatus, setShortlistStatus] = useState({});
  const [isShortlisting, setIsShortlisting] = useState({});

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

  const getBadgeInfo = (score) => {
    const n = Number(score);
    if (n >= 90) return { badge: "A+", icon: "🚀" };
    if (n >= 70) return { badge: "A", icon: "🔥" };
    if (n >= 50) return { badge: "B+", icon: "⚡" };
    if (n >= 30) return { badge: "B", icon: "💼" };
    if (n >= 20) return { badge: "C", icon: "🧐" };
    return { badge: "D", icon: "🐢" };
  };

  return (
    <div className="p-4 overflow-x-auto">
      <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">Talent Manager Roster</h3>

      {/* Filter Section */}
      <div className="mb-6 flex flex-wrap gap-6">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium">Location</label>
          <input
            type="text"
            value={locationSearchInput}
            onChange={(e) => setLocationSearchInput(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Search locations..."
          />
          <div className="border mt-1 p-2 rounded max-h-32 overflow-y-scroll">
            {locationOptions
              .filter((loc) =>
                loc.label.toLowerCase().includes(locationSearchInput.toLowerCase())
              )
              .map((loc, idx) => (
                <label key={idx} className="block text-sm">
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
          <label className="block mb-1 text-sm font-medium">Availability</label>
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="border p-2 w-full rounded"
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
          <label className="block mb-1 text-sm font-medium">Work Mode</label>
          <select
            value={workModeFilter}
            onChange={(e) => setWorkModeFilter(e.target.value)}
            className="border p-2 w-full rounded"
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
            <th className="p-2">Availability</th>
            <th className="p-2">Match %</th>
            <th className="p-2">Badge</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredResults.map((profile, index) => {
            const { badge, icon } = getBadgeInfo(profile.match_score);

            return (
              <tr key={profile.talent_id} className="border-b hover:bg-gray-50">
                <td className="p-2 text-gray-500">{index + 1}</td>
                <td className="p-2 font-medium text-gray-800">{profile.full_name}</td>
                <td className="p-2 text-gray-700">{profile.location || "—"}</td>
                <td className="p-2 text-gray-700">{profile.skills?.join(", ") || "No Skills"}</td>
                <td className="p-2 text-gray-700">{profile.availability || "N/A"}</td>
                <td className="p-2 font-semibold text-green-700">{profile.match_score}%</td>
                <td className="p-2 font-bold text-center">{icon} {badge}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleAiShortlist(profile.talent_id)}
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
    </div>
  );
}

export default TalentManagerView;
