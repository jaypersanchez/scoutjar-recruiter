import { FlexCol } from "@/common/components/flexbox";
import { PageHeader } from "@/common/components/layouts";

import { ProfileForm } from "./components";

export default function Profile() {
  return (
    <FlexCol className="flex flex-col gap-6">
      <PageHeader title="Profile" canGoBack />
      <ProfileForm />
    </FlexCol>
  );
}
