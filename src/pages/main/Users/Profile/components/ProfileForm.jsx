import { useState, useEffect } from "react";
import { cn } from "@/common/lib/utils";
import { WidgetBox } from "@/common/components/layouts";
import { TextField } from "@/common/components/input-fields";
import { FaUserCircle } from "react-icons/fa";

export default function ProfileForm() {
  const [ssoData, setSsoData] = useState({
    full_name: "",
    email: "",
    recruiter_id: null,
  });

  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const baseUrl = `${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_URL}${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_PORT}`;

  useEffect(() => {
    const data = sessionStorage.getItem("sso-login");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setSsoData({
          full_name: parsed.full_name || "",
          email: parsed.email || "",
          recruiter_id: parsed.recruiter_id || null,
        });

        if (parsed.recruiter_id) {
          fetch(`${baseUrl}/talent-profiles/by-recruiter/${parsed.recruiter_id}`)
            .then((res) => res.ok ? res.json() : Promise.reject("Profile not found"))
            .then((data) => {
              if (data.company_name) setCompany(data.company_name);
              if (data.company_website) setWebsite(data.company_website);
            })
            .catch((err) => console.error("Error loading recruiter data:", err));
        }
      } catch (error) {
        console.error("Error parsing sso-login data", error);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("");

    const payload = {
      recruiter_id: ssoData.recruiter_id,
      company_name: company,
      company_website: website,
    };

    try {
      const res = await fetch(`${baseUrl}/talent-profiles/update-recruiter-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      await res.json();
      setStatusMessage("✅ Profile updated successfully!");
    } catch (err) {
      console.error("❌ Update failed:", err);
      setStatusMessage("❌ Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="profile-form-container" onSubmit={handleSubmit}>
  <div className="logo-section">
    <img src="/logo.png" alt="Logo" className="logo-img" />
  </div>

  <div className="profile-fields">
    <div className="readonly-field">
      <label>Full Name</label>
      <input type="text" value={ssoData.full_name} readOnly />
    </div>

    <div className="readonly-field">
      <label>Email</label>
      <input type="email" value={ssoData.email} readOnly />
    </div>

    <div className="editable-field">
      <label>Company Name</label>
      <input
        type="text"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        required
      />
    </div>

    <div className="editable-field">
      <label>Company Website</label>
      <input
        type="url"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        required
      />
    </div>
  </div>

  <div className="button-wrapper">
    <button type="submit" disabled={loading}>
      {loading ? "Saving..." : "Save Profile"}
    </button>
    <p className="status-msg">{statusMessage}</p>
  </div>
</form>

  );
}
