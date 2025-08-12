import React, { useEffect, useState } from "react";
import TalentDetailModal from "../Candidates/ReviewCandidates/TalentDetailModal";
import MessageTalentModal from "../Candidates/ReviewCandidates/MessageTalentModal";
import BadgeAplus from "../../../assets/images/badges-alternative/aplus.png";
import BadgeA from "../../../assets/images/badges-alternative/a.png";
import BadgeBplus from "../../../assets/images/badges-alternative/bplus.png";
import BadgeB from "../../../assets/images/badges-alternative/b.png";
import BadgeC from "../../../assets/images/badges-alternative/c.png";
import BadgeD from "../../../assets/images/badges-alternative/d.png";
import BadgeE from "../../../assets/images/badges-alternative/e.png";

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
  const [messageTalent, setMessageTalent] = useState(null);
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [showLocationModal, setShowLocationModal] = useState(false);

  const baseUrl = `${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_URL}`;
  const AIbaseUrl = `${import.meta.env.VITE_SCOUTJAR_AI_BASE_URL}`;

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

    const salary = Number(profile.desired_salary || 0);
    const currency = profile.currency || "USD";

    const matchesSalary =
      (!minSalary || salary >= Number(minSalary)) &&
      (!maxSalary || salary <= Number(maxSalary));

    const matchesCurrency = selectedCurrency ? currency === selectedCurrency : true;

    return (
      matchesLocation &&
      matchesAvailability &&
      matchesWorkMode &&
      matchesSalary &&
      matchesCurrency
    );
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
    if (n >= 90) return { badge: "A++", image: BadgeAplus };
    if (n >= 80) return { badge: "A+", image: BadgeAplus };
    if (n >= 70) return { badge: "A", image: BadgeA };
    if (n >= 60) return { badge: "B+", image: BadgeBplus };
    if (n >= 50) return { badge: "B", image: BadgeB };
    if (n >= 40) return { badge: "C", image: BadgeC };
    if (n >= 30) return { badge: "D", image: BadgeD };
    return { badge: "E", image: BadgeE };
  };

  return (
    <div className="p-4 overflow-x-auto">
      <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Talent Manager
      </h3>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-start">
        {/* Location Filter */}
        <div className="filter-column filter-field">
          <label className="block font-medium text-sm text-gray-700 mb-1">
            Location
          </label>
          <button
            type="button"
            className="form-button"
            onClick={() => setShowLocationModal(true)}
            style={{ padding: "0.6rem 1rem" }}
          >
            {selectedLocations.length > 0
              ? `Locations (${selectedLocations.length})`
              : "Choose locations"}
          </button>

          {selectedLocations.length > 0 && (
            <div style={{ marginTop: "8px", fontSize: "0.9rem", color: "#444" }}>
              {selectedLocations.slice(0, 3).join(", ")}
              {selectedLocations.length > 3 ? "…" : ""}
            </div>
          )}
        </div>

        {/* Availability */}
        <div>
          <label className="block font-medium text-sm text-gray-700 mb-1">
            Availability
          </label>
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

        {/* Work Mode */}
        <div>
          <label className="block font-medium text-sm text-gray-700 mb-1">
            Work Mode
          </label>
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

        {/* Currency */}
        <div className="filter-column filter-field">
          <label className="block font-medium text-sm text-gray-700 mb-1">
            Currency
          </label>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="login-input"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="ILS">ILS</option>
          </select>
        </div>

        {/* Min Salary */}
        <div className="filter-column filter-field">
          <label className="block font-medium text-sm text-gray-700 mb-1">
            Min Salary
          </label>
          <input
            type="number"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
            className="login-input"
            placeholder="e.g., 1000"
          />
        </div>

        {/* Max Salary */}
        <div className="filter-column filter-field">
          <label className="block font-medium text-sm text-gray-700 mb-1">
            Max Salary
          </label>
          <input
            type="number"
            value={maxSalary}
            onChange={(e) => setMaxSalary(e.target.value)}
            className="login-input"
            placeholder="e.g., 3000"
          />
        </div>
      </div>

          {/* Results */}
<div
  className="mt-5 flex flex-col gap-4 min-h-[300px]"
  style={{ alignItems: filteredResults.length ? "stretch" : "center", justifyContent: filteredResults.length ? "flex-start" : "center" }}
>
  {filteredResults.length ? (
    filteredResults.map((profile) => {
      const { badge, image } = getBadgeInfo(profile.match_score);
      return (
        <div
          key={profile.talent_id}
          onClick={() => setSelectedTalent(profile)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            backgroundColor: "#f9fafb",
            cursor: "pointer",
            width: "100%",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#edf2f7")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#2d3748" }}>
              #{profile.talent_id} — {profile.full_name}
            </div>
            <div style={{ fontSize: "0.95rem", color: "#4a5568", marginTop: 6 }}>
              {profile.email}
            </div>
            <div style={{ fontSize: "0.95rem", color: "#4a5568", marginTop: 6 }}>
              📍 {profile.location} &nbsp;|&nbsp; 🛠️ {profile.skills?.join(", ") || "No Skills"} &nbsp;|&nbsp; 🏢 {profile.work_preferences?.work_mode}
            </div>
            <div style={{ fontSize: "0.9rem", color: "#718096", marginTop: 6 }}>
              Availability: {profile.availability || "N/A"}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, minWidth: 150 }}>
            <div
              style={{
                fontWeight: 900,
                fontSize: "1.1rem",
                padding: "8px 14px",
                borderRadius: 12,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                backgroundColor: "#edf2f7",
                color: "#2d3748",
              }}
            >
              <img src={image} alt={badge} style={{ width: 28, height: 28, objectFit: "contain" }} />
              {Math.round(profile.match_score)}%
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAiShortlist(profile.talent_id);
              }}
              disabled={isShortlisting[profile.talent_id]}
              style={{
                fontSize: 11,
                backgroundColor: "#4c51bf",
                color: "white",
                padding: "4px 8px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              {isShortlisting[profile.talent_id] ? "..." : "📌 Shortlist"}
            </button>

            {shortlistStatus[profile.talent_id] && (
              <div style={{ fontSize: 10, color: "#4c51bf" }}>{shortlistStatus[profile.talent_id]}</div>
            )}
          </div>
        </div>
      );
    })
  ) : (
    <div style={{ color: "#718096", fontSize: "1.1rem" }}>No matching talents found.</div>
  )}
</div>

{/* Detail Modal */}
{selectedTalent && (
  <TalentDetailModal
    applicant={selectedTalent}
    onClose={() => setSelectedTalent(null)}
    showShortlist={false}
    jobTitle={jobTitle}
    jobDescription={jobDescription}
    requiredSkills={requiredSkills}
  />
)}


      {/* Location Modal */}
      {showLocationModal && (
        <div className="modal-overlay" onClick={() => setShowLocationModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Select Locations</h4>
              <button
                className="modal-close"
                onClick={() => setShowLocationModal(false)}
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              value={locationSearchInput}
              onChange={(e) => setLocationSearchInput(e.target.value)}
              placeholder="Search city/country..."
              className="login-input"
              style={{ marginBottom: "0.5rem" }}
            />

            <div className="scrollable-options">
              {/* Select All */}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <input
                  type="checkbox"
                  checked={
                    selectedLocations.length === locationOptions.length &&
                    locationOptions.length > 0
                  }
                  onChange={() => {
                    if (selectedLocations.length === locationOptions.length) {
                      setSelectedLocations([]);
                    } else {
                      setSelectedLocations(locationOptions.map((loc) => loc.value));
                    }
                  }}
                />
                Select All
              </label>

              {/* Location List */}
              {locationOptions
                .filter((loc) =>
                  loc.label
                    .toLowerCase()
                    .includes(locationSearchInput.toLowerCase())
                )
                .map((loc, idx) => (
                  <label
                    key={idx}
                    style={{ display: "block", marginBottom: "6px" }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(loc.value)}
                      onChange={() => toggleLocation(loc.value)}
                      style={{ marginRight: "8px" }}
                    />
                    {loc.label}
                  </label>
                ))}
            </div>

            <div className="modal-actions">
              <button
                className="form-button"
                onClick={() => setShowLocationModal(false)}
              >
                Apply
              </button>
              <button
                className="form-button"
                style={{ background: "#e5e7eb", color: "#111" }}
                onClick={() => {
                  setSelectedLocations([]);
                  setLocationSearchInput("");
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TalentManagerView;
