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
  // Generic function to handle sign in with a given provider
  const handleSSOLogin = (slug) => {
    if (slug === "google") {
      signInWithPopup(auth, googleProvider)
        .then(async (result) => {
          console.log("User signed in with Google:", 
                  result.user.email, result.user.displayName,
                  result.user.photoURL);
          sessionStorage.setItem("sso-login", result.user);
          // Now call the API to create/fetch user profile
          try {
            const profile = await createUserProfile(result.user);
            console.log("User profile from backend:", profile);
          } catch (apiError) {
            console.error(apiError);
            alert("There was an error processing your profile.");
          }
          // Call the onSignIn callback with the Firebase user object
          onSignIn(result.user);
        })
        .catch((error) => {
          console.error("Error signing in with Google:", error);
          alert("Google sign-in failed: " + error.message);
        }); 
    } else if (slug === "github") {
      signInWithPopup(auth, githubProvider)
        .then((result) => {
          console.log("User signed in with GitHub:", result.user);
          sessionStorage.setItem("sso-login", result.user);
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
          sessionStorage.setItem("sso-login", result.user);
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
