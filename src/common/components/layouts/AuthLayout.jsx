import { Outlet, useRouteLoaderData, useNavigation } from "react-router-dom";
import { FlexBox, FlexCol } from "@/common/components/flexbox";
import Footer from "./Footer";

export default function AuthLayout() {
  const data = useRouteLoaderData("main");
  const navigation = useNavigation();

  return (
    <FlexBox className="bg-secondary">
      <FlexCol className="min-h-screen px-1 select-none min-w-[375px] max-w-7xl lg:max-w-2xl flex-1 mx-auto">
        <FlexBox className="gap-2.5 justify-center px-4 pt-6 md:px-6 lg:justify-start">
          <img src="/logo.png" className="w-8" />
          <h6 className="text-xl font-bold leading-9 uppercase tracking-tight text-center text-primary lg:text-start">
            ScoutJar
          </h6>
        </FlexBox>
        <section className="flex flex-col justify-center flex-grow w-full max-w-md lg:max-w-sm xl:max-w-md px-4 py-6 mx-auto">
          <div className="px-4 py-12 md:px-6 lg:px-8">
            <Outlet />
          </div>
        </section>
        <div className="w-full max-w-lg px-8 mx-auto md:px-2 lg:px-0">
          <Footer />
        </div>
      </FlexCol>
      <div className="relative flex-1 hidden lg:block bg-transparent">
        <img
          src="/avatars_bg.svg"
          alt="bg-login"
          className="object-cover w-sm xl:w-2xl mx-auto"
        />
      </div>
    </FlexBox>
  );
}
