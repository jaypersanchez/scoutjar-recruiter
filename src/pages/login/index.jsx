import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Divider } from "@/common/components/ui";
import { FlexCol, FlexColCenter } from "@/common/components/flexbox";
import { SSO } from "./components";
import Forms from "./components/Forms";

export default function LoginPage() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/");
  };

  return (
    <FlexCol className="items-center justify-center w-full h-full min-h-full p-0">
      <div className="w-full max-w-md mx-auto text-center">
        <h2 className="text-4xl font-bold leading-9 tracking-tight text-primary laptop:text-start mb-1.5">
          Welcome back!
        </h2>
        <p className="text-balance text-sm text-gray-400">
          Enter your email below to login to your account
        </p>
      </div>

      <div className="w-full max-w-md mt-6 space-y-8">
        <Forms />
        <Divider label="Or continue with" />
        <SSO
          onSignIn={(slug) => {
            console.log({ "sso-login": slug });
            handleSignIn();
          }}
        />
      </div>
    </FlexCol>
  );
}
