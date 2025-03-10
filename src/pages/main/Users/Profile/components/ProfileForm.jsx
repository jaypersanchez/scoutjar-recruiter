import { cn } from "@/common/lib/utils";

import { WidgetBox } from "@/common/components/layouts";
import { TextField } from "@/common/components/input-fields";

import { FaUserCircle } from "react-icons/fa";

export default function ProfileForm() {
  return (
    <form className="grid grid-cols-2 gap-6">
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
              required
            />
            <TextField
              label="Website"
              type="url"
              name="website"
              id="website"
              autoComplete="website"
              placeholder="https://www.sample-company.com"
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
              required
            />
            <TextField
              label="Email address"
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              placeholder="john.doe@example.com"
              required
            />
          </div>
        </div>
      </WidgetBox>
    </form>
  );
}
