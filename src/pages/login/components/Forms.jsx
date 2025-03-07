import { TextField } from "@/common/components/input-fields";

export default function Forms() {
  return (
    <div>
      <TextField
        label="Email Address"
        type="email"
        name="email"
        id="email-address"
        autoComplete="email"
        noFloatingLabel
        required
      />
    </div>
  );
}
