import { useState } from "react";
import { Link } from "react-router-dom";
import { TextField } from "@/common/components/input-fields";

import { LuEye, LuEyeClosed } from "react-icons/lu";
import { Button } from "@/common/components/ui";

export default function LoginForm({ onSignIn }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    onSignIn({ id: "XYZABC123456", name: "John Doe" });
  };

  return (
    <form className="space-y-4">
      <TextField
        id="email-address"
        label="Email Address"
        type="email"
        name="email"
        autoComplete="email"
        required
      />

      <TextField
        id="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        name="password"
        autoComplete="off"
        required
        slotClassNames={{
          adornment: {
            end: "group-hover:text-gray-400 peer-focus:text-gray-400",
          },
        }}
        endAdornment={
          <Button
            variant="icon"
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
          // type="submit"
          variant="secondary"
          className="w-full h-12 ml-auto text-lg font-semibold tracking-wider uppercase bg-primary mobile:w-1/3 text-neutral-100 hover:bg-primary/90"
          onClick={handleLogin}
        >
          Sign in
        </Button>
      </div>
    </form>
  );
}
