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
            .then((res) => {
              if (!res.ok) throw new Error("Profile not found");
              return res.json();
            })
            .then((data) => {
              if (data.company_name) setCompany(data.company_name);
              if (data.company_website) setWebsite(data.company_website);
            })
            .catch((err) => {
              console.error("Error loading recruiter data:", err);
            });
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
      company,
      website,
    };

    try {
      const res = await fetch(`${baseUrl}/talent-profiles/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await res.json();
      console.log("✅ Profile updated:", data);
      setStatusMessage("✅ Profile updated successfully!");
    } catch (err) {
      console.error("❌ Update failed:", err);
      setStatusMessage("❌ Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
      <WidgetBox className="flex-col gap-6">
        <div className="space-y-6">
          <div className="flex flex-col justify-center flex-1 space-y-2.5">
            <div
              className={cn(
                "p-2 mx-auto border-2 border-dashed border-gray-600/20 rounded-full w-36 h-36"
              )}
            >
              <img
                src="/logo.png"
                alt="logo"
                className="object-cover w-full h-full rounded-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-3">
            <TextField
              label="Company name"
              type="text"
              name="company"
              id="company"
              autoComplete="company"
              placeholder="Sample Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
            <TextField
              label="Website"
              type="url"
              name="website"
              id="website"
              autoComplete="website"
              placeholder="https://www.sample-company.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              required
            />
          </div>
        </div>
      </WidgetBox>
      <WidgetBox className="flex-col gap-6">
        <div className="space-y-6">
          <div className="flex flex-col justify-center flex-1 space-y-2.5">
            <div
              className={cn(
                "p-2 mx-auto border-2 border-dashed border-gray-600/20 rounded-full w-36 h-36"
              )}
            >
              <FaUserCircle className="object-cover w-full h-full rounded-full text-primary" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-3">
            <TextField
              label="Full name"
              type="text"
              name="fullname"
              id="fullname"
              autoComplete="fullname"
              placeholder="John Doe"
              value={ssoData.full_name}
              readOnly
              required
            />
            <TextField
              label="Email address"
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              placeholder="john.doe@example.com"
              value={ssoData.email}
              readOnly
              required
            />
          </div>
          <div className="text-sm text-gray-600 mt-2">{statusMessage}</div>
          <div className="mt-4">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </WidgetBox>
    </form>
  );
}
