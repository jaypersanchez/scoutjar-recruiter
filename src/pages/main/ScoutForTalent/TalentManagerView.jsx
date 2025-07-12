import React from "react";
import { useEffect, useState } from "react";
import TalentDetailModal from "../Candidates/ReviewCandidates/TalentDetailModal";
import MessageTalentModal from "../Candidates/ReviewCandidates/MessageTalentModal";
import BadgeAplus from "../../../assets/images/badges-alternative/aplus.png";
import BadgeA from "../../../assets/images/badges-alternative/a.png";
import BadgeBplus from "../../../assets/images/badges-alternative/bplus.png";
import BadgeB from "../../../assets/images/badges-alternative/b.png";
import BadgeC from "../../../assets/images/badges-alternative/c.png";
import BadgeD from "../../../assets/images/badges-alternative/d.png";
import BadgeE from "../../../assets/images/badges-alternative/e.png"


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

    //return matchesLocation && matchesAvailability && matchesWorkMode;
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

  /*const getBadgeInfo = (score) => {
    const n = Number(score);
    if (n >= 90) return { badge: "A+", image: BadgeAplus };
    if (n >= 70) return { badge: "A", image: BadgeA };
    if (n >= 50) return { badge: "B+", image: BadgeBplus };
    if (n >= 30) return { badge: "B", image: BadgeB };
    if (n >= 20) return { badge: "C", image: BadgeC };
    return { badge: "D", image: BadgeD };
  };*/

  const getBadgeInfo = (score) => {
  const n = Number(score);
  if (n >= 90) return { badge: "A++", image: BadgeAplus }; // You may swap this with a separate Dark Green image if needed
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
  <input
    type="text"
    value={locationSearchInput}
    onChange={(e) => setLocationSearchInput(e.target.value)}
    placeholder="Search city/country..."
    className="login-input mb-2"
  />

  <div className="max-h-60 overflow-y-auto rounded border border-gray-300 bg-white px-3 py-2 min-w-[300px] space-y-1">
    {/* Select All */}
    <div className="flex items-center gap-2 text-sm text-gray-700 w-full">
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
        className="h-4 w-4 text-indigo-600"
      />
      <span className="font-medium">Select All</span>
    </div>

    {/* Location List */}
    {locationOptions
      .filter((loc) =>
        loc.label.toLowerCase().includes(locationSearchInput.toLowerCase())
      )
      .map((loc, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2 text-sm text-gray-700 w-full"
        >
          <input
            type="checkbox"
            checked={selectedLocations.includes(loc.value)}
            onChange={() => toggleLocation(loc.value)}
            className="h-4 w-4 text-indigo-600"
          />
          <span className="font-normal break-words">{loc.label}</span>
        </div>
      ))}
  </div>
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

    {/* Table rendering stays unchanged */}
    {/* ... rest of your table and modal rendering logic ... */}
  </div>
);

}

export default TalentManagerView;
