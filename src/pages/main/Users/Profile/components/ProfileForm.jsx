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
  const [logo, setLogo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [profileData, setProfileData] = useState({});

  const baseUrl = `${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_URL}`;

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
            setProfileData(data); // ✅ This ensures company_logo and other fields are available
          })
          .catch((err) => console.error("Error loading recruiter data:", err));
      }
    } catch (error) {
      console.error("Error parsing sso-login data", error);
    }
  }
}, []);


  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleLogoClick = () => {
    document.getElementById('logoInput').click();
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setStatusMessage("");

  const formData = new FormData();
  formData.append("recruiter_id", ssoData.recruiter_id);
  formData.append("company_name", company);
  formData.append("company_website", website);
  if (logo) {
    formData.append("company_logo", logo);
  }

  try {
    const res = await fetch(`${baseUrl}/talent-profiles/update-recruiter-profile`, {
      method: "POST",
      body: formData, // DO NOT set headers when using FormData
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

  /*const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("");

    
    const formData = new FormData();
    formData.append("recruiter_id", ssoData.recruiter_id);
    formData.append("company_name", company);
    formData.append("company_website", website);
    if (logo) {
        formData.append("company_logo", logo);
    }


    try {
      const res = await fetch(`${baseUrl}/talent-profiles/update-recruiter-profile`, {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: formData, //JSON.stringify(payload),
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
  };*/

  return (
    <form className="profile-form-container" onSubmit={handleSubmit}>
  {/*<div className="logo-section">
    <img src="/logo.png" alt="Logo" className="logo-img" />
  </div>*/}

  {/*  {profileData.company_logo && (
  <img
    src={`${baseUrl}${profileData.company_logo}`}
    alt="Current company logo"
    style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", marginBottom: "10px" }}
  />
)}*/}

  <div className="logo-section">
  <input
    id="logoInput"
    type="file"
    accept="image/*"
    style={{ display: "none" }}
    onChange={handleLogoChange}
  />
  
  <img
    src={
      previewUrl
        ? previewUrl
        : profileData.company_logo
        ? `${baseUrl}${profileData.company_logo}`
        : "/recruiter/lookk.png"
    }
    alt="Company Logo"
    onClick={handleLogoClick}
    style={{
      cursor: "pointer",
      borderRadius: "50%",
      width: "120px",
      height: "120px",
      objectFit: "cover",
      border: "2px solid #ccc",
      marginBottom: "10px",
    }}
    title="Click to upload company logo"
  />
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
