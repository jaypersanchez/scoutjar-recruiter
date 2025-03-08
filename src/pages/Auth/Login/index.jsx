import { useNavigate } from "react-router-dom";
import { useAuth } from "@/common/hooks";
import { Divider } from "@/common/components/ui";
import { FlexCol } from "@/common/components/flexbox";
import { LoginForm, SSOLogin } from "./components";

export default function LoginPage() {
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSignIn = () => {
    login({ id: "XYZABC123456", name: "John Doe" });
    navigate("/");
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
      </div>

      <div className="w-full max-w-md mt-6 space-y-8">
        <LoginForm />
        <Divider label="Or continue with" />
        <SSOLogin
          onSignIn={(slug) => {
            console.log({ "sso-login": slug });
            handleSignIn();
          }}
        />
      </div>
    </FlexCol>
  );
}
