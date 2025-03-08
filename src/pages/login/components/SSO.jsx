import { FlexBox, FlexCol } from "@/common/components/flexbox";
import { Button } from "@/common/components/ui";
import { FaGoogle, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";

const SSOProviders = [
  { id: 0, slug: "google", icon: FaGoogle },
  { id: 1, slug: "linkedin", icon: FaLinkedin },
  { id: 2, slug: "twitter", icon: FaTwitter },
  { id: 3, slug: "instagram", icon: FaInstagram },
];

export default function SSO({ onSignIn }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {SSOProviders.map((data) => (
        <Button
          key={data.id}
          variant="outline"
          className="border-gray-300 h-11 hover:bg-gray-300/70"
          onClick={() => onSignIn(data.slug)}
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
