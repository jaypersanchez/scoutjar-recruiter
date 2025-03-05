import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Divider } from "@/common/components/ui";
import { FlexCol, FlexColCenter } from "@/common/components/flexbox";
import { Roles, SSO } from "./components";

export default function LoginPage() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = () => {
    if (role === "talent-scout") {
      navigate("/");
    } else if (role === "talent") {
      navigate("/talent");
    }
  };

  return (
    <FlexCol className="items-center justify-center w-full h-full min-h-full p-0">
      <div className="w-full max-w-md mx-auto text-center">
        <h2 className="text-4xl font-bold leading-9 tracking-tight text-primary laptop:text-start mb-1.5">
          Welcome back!
        </h2>
        <p className="text-balance text-sm text-gray-400">
          Select your role to continue
        </p>
      </div>

      <div className="w-full max-w-md mt-6 space-y-8">
        <Roles onRoleChange={(value) => setRole(value)} />

        <Divider label="Sign in with" />
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
