import { useEffect } from "react";
import { Button } from "@/common/components/ui";
import {
  FaGoogle,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaGithub,
  
} from "react-icons/fa";
import { signInWithPopup, fetchSignInMethodsForEmail } from "firebase/auth";
import {
  auth,
  googleProvider,
  githubProvider,
  twitterProvider,
} from "../../../../firebase/firebaseConfig";

const SSOProviders = [
  { id: 0, slug: "github", icon: FaGithub },
  { id: 1, slug: "google", icon: FaGoogle },
  { id: 2, slug: "linkedin", icon: FaLinkedin },
  { id: 3, slug: "twitter", icon: FaTwitter },
  { id: 4, slug: "instagram", icon: FaInstagram },
  /*{ id: 5, slug: "apple", icon: FaApple },*/
];

// Helper function to create or fetch user profile via API call
const createUserProfile = async (user) => {
  const payload = {
    email: user.email,
    full_name: user.displayName,
    profile_picture: user.photoURL,
    user_type: "Scout",
  };

  const baseUrl = `${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_URL}${import.meta.env.VITE_SCOUTJAR_SERVER_BASE_PORT}`;
  const response = await fetch(`${baseUrl}/user_profiles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Error inserting/fetching user profile");
  }

  return response.json();
};

export default function SSOLogin({ onSignIn }) {

  useEffect(() => {
    const clearOnReload = () => {
      if (process.env.NODE_ENV === "development") {
        sessionStorage.removeItem("sso-login");
      }
    };
  
    window.addEventListener("beforeunload", clearOnReload);
    return () => window.removeEventListener("beforeunload", clearOnReload);
  }, []);
  

  const createSSOData = (user) => {
    const ssoData = {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };

    console.log(ssoData);
  };

  const handleSSOLogin = (slug) => {
    console.log("SSO Login triggered for:", slug);

    if (slug === "google") {
      signInWithPopup(auth, googleProvider)
        .then(async (result) => {
          try {
            const profile = await createUserProfile(result.user);
            const combinedData = {
              user_id: profile.user.user_id,
              email: profile.user.email,
              full_name: profile.user.full_name,
              profile_picture: profile.user.profile_picture,
              recruiter_id: profile.recruiter?.recruiter_id,
              company_name: profile.recruiter?.company_name,
              company_website: profile.recruiter?.company_website,
              industry: profile.recruiter?.industry,
              company_logo: profile.recruiter?.company_logo,
              created_at: profile.recruiter?.created_at,
            };
            sessionStorage.setItem("sso-login", JSON.stringify(combinedData));
            onSignIn(combinedData);
          } catch (apiError) {
            sessionStorage.removeItem("sso-login");
            console.error(apiError);
            alert("There was an error processing your profile.");
          }
        })
        .catch((error) => {
          sessionStorage.removeItem("sso-login");
          console.error("Error signing in with Google:", error);
          alert("Google sign-in failed: " + error.message);
        });
    } else if (slug === "github") {
      console.log("Attempting GitHub sign-in...");
      signInWithPopup(auth, githubProvider)
        .then(async (result) => {
          console.log("GitHub sign-in success:", result.user);
          try {
            const profile = await createUserProfile(result.user);
            const combinedData = {
              user_id: profile.user.user_id,
              email: profile.user.email,
              full_name: profile.user.full_name,
              profile_picture: profile.user.profile_picture,
              recruiter_id: profile.recruiter?.recruiter_id,
              company_name: profile.recruiter?.company_name,
              company_website: profile.recruiter?.company_website,
              industry: profile.recruiter?.industry,
              company_logo: profile.recruiter?.company_logo,
              created_at: profile.recruiter?.created_at,
            };
            sessionStorage.setItem("sso-login", JSON.stringify(combinedData));
            onSignIn(combinedData);
          } catch (apiError) {
            sessionStorage.removeItem("sso-login");
            console.error(apiError);
            alert("There was an error processing your profile.");
          }
        })
        .catch(async (error) => {
          console.error("GitHub sign-in error:", error);
          if (error.code === "auth/account-exists-with-different-credential") {
            const email = error.customData.email;
            const pendingCred = error.credential;

            const methods = await fetchSignInMethodsForEmail(auth, email);

            if (methods.includes("google.com")) {
              alert("This email is already linked to a Google account. Please sign in with Google to link your GitHub account.");

              signInWithPopup(auth, googleProvider)
                .then((googleResult) => {
                  googleResult.user
                    .linkWithCredential(pendingCred)
                    .then(async (linkResult) => {
                      console.log("GitHub linked to Google:", linkResult.user);
                      try {
                        const profile = await createUserProfile(linkResult.user);
                        const combinedData = {
                          user_id: profile.user.user_id,
                          email: profile.user.email,
                          full_name: profile.user.full_name,
                          profile_picture: profile.user.profile_picture,
                          recruiter_id: profile.recruiter?.recruiter_id,
                          company_name: profile.recruiter?.company_name,
                          company_website: profile.recruiter?.company_website,
                          industry: profile.recruiter?.industry,
                          company_logo: profile.recruiter?.company_logo,
                          created_at: profile.recruiter?.created_at,
                        };
                        sessionStorage.setItem("sso-login", JSON.stringify(combinedData));
                        onSignIn(combinedData);
                      } catch (apiError) {
                        sessionStorage.removeItem("sso-login");
                        console.error(apiError);
                        alert("There was an error processing your profile.");
                      }
                    })
                    .catch((linkError) => {
                      console.error("Error linking GitHub:", linkError);
                      alert("Linking failed: " + linkError.message);
                    });
                })
                .catch((googleError) => {
                  console.error("Google sign-in during linking failed:", googleError);
                  alert("Google sign-in failed: " + googleError.message);
                });
            } else {
              alert("This email is already associated with another sign-in method. Please use that method to log in.");
            }
          } else {
            alert("GitHub sign-in failed: " + error.message);
          }
        });
    } else if (slug === "twitter") {
      signInWithPopup(auth, twitterProvider)
        .then((result) => {
          console.log("User signed in with Twitter:", result.user);
          createSSOData(result.user);
          onSignIn(result.user);
        })
        .catch((error) => {
          console.error("Error signing in with Twitter:", error);
          alert("Twitter sign-in failed: " + error.message);
        });
    } else if (slug === "linkedin") {
      alert("LinkedIn sign-in is not supported by Firebase Authentication by default. You'll need a custom OAuth flow or a third-party solution.");
    } else if (slug === "instagram") {
      alert("Instagram sign-in is not implemented yet.");
    } else if (slug === "apple") {
      alert("Apple sign-in is not implemented yet.");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
    {SSOProviders
      .filter((data) => data.slug !== "twitter" && data.slug !== "instagram")
      .map((data, index) => (
        <Button
  key={index}
  variant="outline"
  className="border-[var(--primary)] h-11 hover:bg-[var(--accent)] text-[var(--accent)] hover:text-white"
  onClick={() => handleSSOLogin(data.slug)}
>

          <data.icon className="w-8 h-8" />
          <p className="text-sm font-bold tracking-wider uppercase">
            {data.slug}
          </p>
        </Button>
      ))}
  </div>
  );
}
