import { useState, useEffect } from "react";
import { cn } from "@/common/lib/utils";
import { WidgetBox } from "@/common/components/layouts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
} from "@/common/components/ui";
import { TextField } from "@/common/components/input-fields";
import { FlexBox, FlexCol } from "@/common/components/flexbox";

import { FaUserCircle } from "react-icons/fa";
import { IoCamera } from "react-icons/io5";

export default function ProfileForm() {
  const [companyLogo, setCompanyLogo] = useState(null);
  const data = {
    photo: "/logo.png",
    name: "",
    email: "firstname.lastname@gmail.com",
    company: {
      name: "Company Name",
      website: "https://company.website.com",
      logo: "/logo.png",
    },
  };

  const handleImageUpload = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.target.files[0];

    if (file) {
      const fileName = file.name;
      const fileType = file.type;
      const fileSize = file.size / 1024 / 1024;
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

      if (!allowedTypes.includes(fileType)) {
        //set error
        console.error(
          "File type not allowed. Allowed types: .jpeg, .jpg, .png, .gif"
        );
        return;
      }

      if (fileSize > 2) {
        //set error
        console.error("File size exceeds 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result);
      };
      reader.readAsDataURL(file);

      console.log({ fileType, fileSize, file, fileName });
    }
  };

  const [ssoData, setSsoData] = useState({
    full_name: "",
    email: "",
  });

  useEffect(() => {
    const data = sessionStorage.getItem("sso-login");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setSsoData({
          full_name: parsed.full_name || "",
          email: parsed.email || "",
        });
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
        <AvatarImage src={data.photo ?? ""} className="rounded-full" />
        <AvatarFallback className="bg-secondary">
          <FaUserCircle className="text-primary h-full w-full" />
        </AvatarFallback>
      </Avatar>

      <WidgetBox className="w-full max-w-4xl mx-auto flex-col gap-10">
        <FlexCol className="max-w-md w-full mx-auto mt-16 mb-20">
          {/* User Email */}
          <div className="px-4 sm:px-0 text-center select-text">
            <p className="mt-1 max-w-2xl text-sm/6 text-gray-500 break-all">
              {data.email}
            </p>
          </div>

          {/* Profile */}
          <div className="px-4 sm:px-0 mt-20">
            <h3 className="text-base/7 font-semibold text-gray-900">Profile</h3>
            <p className="max-w-2xl text-sm/4 text-gray-500">
              Account information.
            </p>
          </div>
          <div className="mt-6 border-t border-gray-300">
            <dl className="divide-y divide-gray-300">
              {/* Name */}
              <div className="px-4 py-6 sm:px-0">
                <TextField
                  label="Full Name"
                  type="text"
                  name="full_name"
                  id="full_name"
                  autoComplete="full_name"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </dl>
          </div>

          {/* Company */}
          <div className="px-4 sm:px-0 mt-14">
            <h3 className="text-base/7 font-semibold text-gray-900">Company</h3>
            <p className="max-w-2xl text-sm/4 text-gray-500">
              Details about the company.
            </p>
          </div>
          <div className="mt-6 border-t border-gray-300">
            <dl className="divide-y divide-gray-300">
              {/* Logo */}
              <div className="px-4 py-6 sm:px-0">
                <div className="text-sm/6 font-semibold px-1 text-primary mb-4">
                  Logo
                </div>

                <label
                  htmlFor="image"
                  className={cn(
                    "flex flex-col items-center justify-center text-xs font-semibold leading-6 text-center rounded-md cursor-pointer border-2 border-dashed group border-gray-600/20 hover:border-gray-600/40 hover:bg-gray-500/10 py-6"
                  )}
                >
                  {companyLogo ? (
                    <Avatar className="w-14 h-14 mb-2">
                      <AvatarImage src={companyLogo} />
                      <AvatarFallback>N/A</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div>
                      <IoCamera
                        className="w-8 h-8 mx-auto text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="leading-8">Upload Logo</span>
                    </div>
                  )}

                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept=".jpeg,.jpg,.png"
                    className="sr-only"
                    onChange={handleImageUpload}
                  />
                  <div className="text-center">
                    <p className="text-xs/5 font-medium text-gray-600">
                      Allowed *.jpeg, *.jpg, *.png
                    </p>
                    <p className="text-xs/5 font-medium text-gray-600">
                      max size of 2Mb only
                    </p>
                  </div>
                </label>
              </div>

              {/* Company Name */}
              <div className="px-4 py-6 sm:px-0">
                <TextField
                  label="Name"
                  type="text"
                  name="company_name"
                  id="company_name"
                  autoComplete="company_name"
                  placeholder="Enter your company name"
                  value={ssoData.full_name}
                  readOnly
                  required
                />
              </div>

              {/* Company Website */}
              <div className="px-4 py-6 sm:px-0">
                <TextField
                  label="Website"
                  type="url"
                  name="company_website"
                  id="company_website"
                  autoComplete="company_website"
                  placeholder="www.company.com"
                  value={ssoData.email}
                  readOnly
                  required
                  startAdornment={
                    <div className="text-gray-500 font-semibold text-sm">
                      https://
                    </div>
                  }
                  slotClassNames={{
                    input: "pl-20",
                    adornment: {
                      start: "left-4",
                    },
                  }}
                />
              </div>
            </dl>
          </div>
        </FlexCol>
        <FlexBox className="justify-end flex-1">
          <Button type="submit">Update Profile</Button>
        </FlexBox>
      </WidgetBox>
    </div>
  );
}
