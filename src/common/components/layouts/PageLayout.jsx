import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { IoIosArrowUp } from "react-icons/io";
import { Button } from "@/common/components/ui";
import Footer from "../templates/Footer";

export default function PageLayout() {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="min-h-screen min-w-[360px] select-none flex">
      {/* <Sidebar /> */}
      <main className="relative flex flex-col flex-1 min-h-full overflow-hidden">
        {/* <Navbar /> */}
        <div className="flex-1 px-6 py-10 overflow-hidden desktop:px-10">
          <Outlet />
        </div>
        <Footer className="justify-end" />

        {isVisible && (
          <Button
            size="icon"
            className="fixed z-50 w-10 h-10 shadow-none bottom-6 right-6"
            onClick={scrollToTop}
          >
            <IoIosArrowUp className="w-5 h-5" />
          </Button>
        )}
      </main>
    </div>
  );
}
