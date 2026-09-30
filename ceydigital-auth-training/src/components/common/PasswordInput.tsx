import { Form, Input } from "antd";

export function PasswordInput({
  name,
  label,
  placeholder,
  autoComplete = "new-password",
}: {
  name: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={[{ required: true, min: 8, message: "At least 8 characters" }]}
    >
      <Input.Password placeholder={placeholder} autoComplete={autoComplete} />
    </Form.Item>
  );
}