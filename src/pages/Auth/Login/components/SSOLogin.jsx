import { Button } from "@/common/components/ui";
import {
  FaGoogle,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaGithub,
  FaApple,
} from "react-icons/fa";

const SSOProviders = [
  { id: 0, slug: "github", icon: FaGithub },
  { id: 1, slug: "google", icon: FaGoogle },
  { id: 2, slug: "linkedin", icon: FaLinkedin },
  { id: 3, slug: "twitter", icon: FaTwitter },
  { id: 4, slug: "instagram", icon: FaInstagram },
  { id: 5, slug: "apple", icon: FaApple },
];

export default function SSOLogin({ onSignIn }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {SSOProviders.map((data, index) => (
        <Button
          key={index}
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
