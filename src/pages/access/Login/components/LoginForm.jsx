import { useState, useEffect } from "react";useEffect
import { Link, useNavigate } from "react-router-dom"; // ← useNavigate here
import { TextField } from "@/common/components/input-fields";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { Button } from "@/common/components/ui";

export default function LoginForm({ onSignIn }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // ← navigate initialized
  const baseUrl = `${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_URL}`;
  useEffect(() => {
    const clearOnReload = () => {
      if (process.env.NODE_ENV === "development") {
        sessionStorage.removeItem("sso-login");
      }
    };
  
    window.addEventListener("beforeunload", clearOnReload);
    return () => window.removeEventListener("beforeunload", clearOnReload);
  }, []);
  
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      const combinedData = {
        user_id: data.user.user_id,
        email: data.user.email,
        full_name: data.user.full_name,
        profile_picture: data.user.profile_picture,
        user_type: data.user.user_type,
        created_at: data.user.created_at,
        recruiter_id: data.recruiter?.recruiter_id,
        company_name: data.recruiter?.company_name,
        company_website: data.recruiter?.company_website,
        industry: data.recruiter?.industry,
        company_logo: data.recruiter?.company_logo,
      };

      sessionStorage.setItem("sso-login", JSON.stringify(combinedData));

      // Trigger shared app state update if needed
      if (onSignIn) {
        onSignIn(combinedData);
      }

      // Always redirect to /dashboard after login
      //navigate("/dashboard");
      //navigate("/");
    } catch (err) {
      console.error("Login error:", err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="login-card space-y-4" onSubmit={handleSubmit}>
  <TextField
    id="email-address"
    label="Email Address"
    type="email"
    name="email"
    autoComplete="email"
    required
    value={formData.email}
    onChange={handleChange}
    className="login-input"
  />

  <TextField
    id="password"
    label="Password"
    type={showPassword ? "text" : "password"}
    name="password"
    autoComplete="off"
    required
    value={formData.password}
    onChange={handleChange}
    slotClassNames={{
      adornment: {
        end: "group-hover:text-gray-400 peer-focus:text-gray-400",
      },
    }}
    endAdornment={
      <Button
        variant="icon"
        type="button"
        className="!p-0 h-fit hover:text-tertiary"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <LuEyeClosed className="!h-6 !w-6" />
        ) : (
          <LuEye className="!h-6 !w-6" />
        )}
      </Button>
    }
  />

  <div className="flex flex-col items-center mobile:flex-row gap-y-6 mt-6">
    <div className="flex items-center order-last space-x-2 mobile:order-first">
      <Link
        to="reset-password"
        className="text-sm font-medium leading-none tracking-wide text-neutral-500 hover:underline underline-offset-4"
      >
        Forgot your password?
      </Link>
    </div>
    <Button
      type="submit"
      variant="secondary"
      disabled={loading}
      className="login-button w-full h-12 ml-auto text-lg font-semibold tracking-wider uppercase mobile:w-1/3"
    >
      {loading ? "Signing in..." : "Sign in"}
    </Button>
  </div>
</form>

  );
}
