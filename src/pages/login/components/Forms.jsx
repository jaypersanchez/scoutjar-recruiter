import { FlexCol } from "@/common/components/flexbox";
import { TextField } from "@/common/components/input-fields";

import { FaLock, FaEye } from "react-icons/fa";

export default function Forms() {
  return (
    <FlexCol className="gap-4">
      <TextField
        label="Email Address"
        type="email"
        name="email"
        id="email-address"
        autoComplete="email"
        helperText="This is a helper text"
        required
      />

      <TextField
        value="zxca"
        label="Email Error"
        type="email"
        name="email"
        id="email-address"
        autoComplete="email"
        error
        helperText="This is an error"
        required
      />

      <TextField
        value="zxca"
        label="Email readOnly"
        type="email"
        name="email"
        id="email-address"
        autoComplete="email"
        readOnly
        helperText="This is a read only field"
        required
      />

      <TextField
        value="zxca"
        label="Email disabled"
        type="email"
        name="email"
        id="email-address"
        autoComplete="email"
        disabled
        required
      />
    </FlexCol>
  );
}
