import { Button } from "@/common/components/ui";
import {
  FaGoogle,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaGithub,
  FaApple,
} from "react-icons/fa";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider, twitterProvider } from "../../../../firebase/firebaseConfig";


const SSOProviders = [
  { id: 0, slug: "github", icon: FaGithub },
  { id: 1, slug: "google", icon: FaGoogle },
  { id: 2, slug: "linkedin", icon: FaLinkedin },
  { id: 3, slug: "twitter", icon: FaTwitter },
  { id: 4, slug: "instagram", icon: FaInstagram },
  { id: 5, slug: "apple", icon: FaApple },
];

// Helper function to create or fetch user profile via API call
const createUserProfile = async (user) => {
  const payload = {
    email: user.email,
    full_name: user.displayName,
    profile_picture: user.photoURL,
    user_type: "Scout"
  };

  const response = await fetch("http://localhost:5000/user_profiles", {
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

  const createSSOData = (user) => {
    const ssoData = {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };

    sessionStorage.setItem("sso-login", JSON.stringify(ssoData));
    console.log(ssoData);
  }

  // Generic function to handle sign in with a given provider
  const handleSSOLogin = (slug) => {
    if (slug === "google") {
      signInWithPopup(auth, googleProvider)
        .then(async (result) => {
          /*console.log("User signed in with Google:", 
                  result.user.email, result.user.displayName,
                  result.user.photoURL);
                  sessionStorage.setItem("sso-login", JSON.stringify(result.user));*/
          createSSOData(result.user)
          // Now call the API to create/fetch user profile
          try {
            const profile = await createUserProfile(result.user);
            console.log("User profile from backend:", profile);
            // Retrieve the SSO data from session storage
            //const ssoData = JSON.parse(sessionStorage.getItem("sso-login"));

            // Combine the SSO data with the recruiter record.
            // Build the combined object that includes the user_id and recruiter_id along with other info
            const combinedData = {
              // Data from user_profiles
              user_id: profile.user.user_id,
              email: profile.user.email,
              full_name: profile.user.full_name,
              profile_picture: profile.user.profile_picture,
              // Data from talent_recruiters
              recruiter_id: profile.recruiter.recruiter_id,
              company_name: profile.recruiter.company_name,
              company_website: profile.recruiter.company_website,
              industry: profile.recruiter.industry,
              company_logo: profile.recruiter.company_logo,
              created_at: profile.recruiter.created_at,
              // Additional SSO data
              //displayName: ssoData.displayName,
              //photoURL: ssoData.photoURL,
            };

            console.log("Combined SSO + Recruiter Data:", combinedData);
            // Save combinedData as the complete user session info
            sessionStorage.setItem("sso-login", JSON.stringify(combinedData));
            // Call the onSignIn callback with the Firebase user object
            onSignIn(combinedData);
          } catch (apiError) {

            console.error(apiError);
            alert("There was an error processing your profile.");
          }
          
        })
        .catch((error) => {
          console.error("Error signing in with Google:", error);
          alert("Google sign-in failed: " + error.message);
        }); 
    } else if (slug === "github") {
      signInWithPopup(auth, githubProvider)
        .then((result) => {
          console.log("User signed in with GitHub:", result.user);
          //sessionStorage.setItem("sso-login", result.user);
          createSSOData(result.user)
          onSignIn(result.user);
        })
        .catch((error) => {
          console.error("Error signing in with GitHub:", error);
          alert("GitHub sign-in failed: " + error.message);
        });
    } else if (slug === "twitter") {
      signInWithPopup(auth, twitterProvider)
        .then((result) => {
          console.log("User signed in with Twitter:", result.user);
          //sessionStorage.setItem("sso-login", result.user);
          createSSOData(result.user)
          onSignIn(result.user);
        })
        .catch((error) => {
          console.error("Error signing in with Twitter:", error);
          alert("Twitter sign-in failed: " + error.message);
        });
    } else if (slug === "linkedin") {
      //sessionStorage.setItem("sso-login", result.user);
      alert("LinkedIn sign-in is not supported by Firebase Authentication by default. You'll need a custom OAuth flow or a third-party solution.");
    } else if (slug === "instagram") {
      alert("Instagram sign-in is not implemented yet.");
    } else if (slug === "apple") {
      alert("Apple sign-in is not implemented yet.");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {SSOProviders.map((data, index) => (
        <Button
          key={index}
          variant="outline"
          className="border-gray-300 h-11 hover:bg-gray-300/70"
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
