import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/common/lib/utils";
import { WidgetBox } from "@/common/components/layouts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
} from "@/common/components/ui";
import { FlexBox, FlexCol } from "@/common/components/flexbox";
import { MdEdit } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

/**
 * Get the initials of a name
 *
 * @example
 * getInitials("John Doe") // "JD"
 * getInitials("John") // "J"
 * getInitials("John Doe Smith") // "JS"
 * getInitials(null || undefined) // "N/A"
 */
const getInitials = (name) => {
  if (!name || typeof name !== "string") return "N/A";

  const words = name.split(/\s+/).filter(Boolean); // Split by spaces & remove empty values
  const first = words[0]?.[0]?.toUpperCase() || "";
  const last = words.length > 1 ? words[words.length - 1][0].toUpperCase() : "";

  return first + last || "N/A";
};

export default function ProfileView() {
  const navigate = useNavigate();

  const [ssoData, setSsoData] = useState({
    photo: "/logo.png",
    name: "FirstName LastName",
    email: "firstname.lastname@gmail.com",
  });

  const companyData = {
    name: "Company Name",
    website: "https://company.website.com",
    logo: "/logo.png",
  };

  useEffect(() => {
    const data = sessionStorage.getItem("sso-login");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setSsoData((prev) => ({
          ...prev,
          full_name: parsed.full_name || "Anonymous",
          email: parsed.email || "anonymous@email.com",
        }));
      } catch (error) {
        console.error("Error parsing sso-login data", error);
      }
    }
  }, []);

  return (
    <div className="relative mt-20">
      <Avatar
        className={cn(
          "absolute -top-20 inset-x-0 mx-auto border-2 border-primary w-40 h-40 p-0.5 overflow-hidden rounded-full"
        )}
      >
        <AvatarImage src={ssoData.photo} className="rounded-full" />
        <AvatarFallback className="bg-secondary">
          <FaUserCircle className="text-primary h-full w-full" />
        </AvatarFallback>
      </Avatar>

      <WidgetBox className="w-full max-w-4xl mx-auto flex-col gap-10">
        <FlexBox className="justify-end flex-1">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => navigate("/profile/edit")}
          >
            <MdEdit />
          </Button>
        </FlexBox>

        <FlexCol className="max-w-md w-full mx-auto mb-20">
          {/* User name and Email */}
          <div className="px-4 sm:px-0 text-center select-text">
            <h3 className="text-4xl font-bold text-gray-900 break-all text-pretty">
              {ssoData.name}
            </h3>
            <p className="mt-1 max-w-2xl text-sm/6 text-gray-500 break-all">
              {ssoData.email}
            </p>
          </div>

          <div className="px-4 sm:px-0 mt-20">
            <h3 className="text-base/7 font-semibold text-gray-900">Company</h3>
            <p className="max-w-2xl text-sm/4 text-gray-500">
              Details about the company.
            </p>
          </div>
          <div className="mt-6 border-t border-gray-300">
            <dl className="divide-y divide-gray-300">
              {/* Logo */}
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900">Logo</dt>

                <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={companyData.logo} />
                    <AvatarFallback>
                      {getInitials(companyData.name)}
                    </AvatarFallback>
                  </Avatar>
                </dd>
              </div>

              {/* Name */}
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900">Name</dt>
                <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 select-text break-all text-pretty">
                  {companyData.name}
                </dd>
              </div>

              {/* Website */}
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900">Website</dt>
                <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 select-text break-all text-pretty">
                  {companyData.website}
                </dd>
              </div>
            </dl>
          </div>
        </FlexCol>
      </WidgetBox>
    </div>
  );
}
