import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/common/hooks";
import { Divider } from "@/common/components/ui";
import { FlexCol } from "@/common/components/flexbox";
import  LoginForm  from "./LoginForm";
import  SSOLogin  from "./SSOLogin"

console.log("LoginForm:", LoginForm);
console.log("SSOLogin:", SSOLogin);

export default function LoginPage() {
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSignIn = (userData) => {
    login(userData); //login({ id: "XYZABC123456", name: "John Doe" });
    navigate("/recruiter/dashboard");
  };

  return (
    <FlexCol className="items-center justify-center w-full h-full min-h-full p-0">
     <div className="w-full max-w-md mx-auto text-center">
        <h2 className="text-4xl font-bold leading-9 tracking-tight text-primary laptop:text-start mb-1.5">
          Welcome back!
        </h2>
        <p className="text-balance text-sm text-gray-400">
          Sign in to your account
        </p>
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-900 rounded-md p-3 mt-4 text-sm font-medium shadow-sm">
          ⚠️ <strong>First time here?</strong> A user account and profile is automatically created when you sign in.
          Just sign-in using your social media account or provide a valid email address and password.  
          You can update your account details later in the <strong>Settings - Profile</strong> section.
        </div>
      </div>


      <div className="w-full max-w-md mt-6 space-y-8">
        <LoginForm onSignIn={handleSignIn}/>
        <Divider label="Or continue with" />
        <SSOLogin onSignIn={handleSignIn} />

        {/*<SSOLogin
          onSignIn={(userData) => {
            console.log({ "sso-login": userData });
            sessionStorage.setItem("sso-login", userData)
            handleSignIn(userData);
          }}
        />*/}

      <p className="text-sm font-medium text-center text-gray-500 mt-4 px-4">
        By signing in to LooKK, you agree to our{" "}
        <Link
    to="/recruiter/terms"
    className="underline font-semibold text-gray-600 hover:text-gray-800 transition"
  >
    Terms&nbsp;and&nbsp;Conditions
  </Link>
        {/*<a
          href={`${import.meta.env.BASE_URL}TermsCondition.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold text-gray-600 hover:text-gray-800 transition"
        >
          Terms&nbsp;and&nbsp;Conditions
        </a>*/}
        
      </p>

      </div>
    </FlexCol>
  );
}
