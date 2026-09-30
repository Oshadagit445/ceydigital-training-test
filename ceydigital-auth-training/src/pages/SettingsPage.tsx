import { useState } from "react";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { apiFetch } from "../api/client";
import type { ApiError } from "../features/auth/types";

const { Title } = Typography;

type FormValues = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};

export default function SettingsPage() {
  const [form] = Form.useForm<FormValues>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleFinish(values: FormValues) {
    if (values.new_password !== values.confirm_password) {
      form.setFields([{ name: "confirm_password", errors: ["Passwords do not match"] }]);
      return;
    }
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await apiFetch("/api/users/me/password", {
        method: "PATCH",
        body: JSON.stringify({
          current_password: values.current_password,
          new_password: values.new_password,
        }),
      });
      setSaved(true);
      form.resetFields();
    } catch (err) {
      setError((err as ApiError).message ?? "Could not change password");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Title level={2}>Settings</Title>
      <Card title="Change Password" style={{ maxWidth: 480 }}>
        {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
        {saved && <Alert type="success" message="Password updated" style={{ marginBottom: 16 }} />}
        <Form form={form} layout="vertical" onFinish={handleFinish} disabled={saving}>
          <Form.Item
            label="Current Password"
            name="current_password"
            rules={[{ required: true }]}
          >
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="new_password"
            rules={[{ required: true, min: 8 }]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            label="Confirm New Password"
            name="confirm_password"
            rules={[{ required: true }]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={saving}>
            Update Password
          </Button>
        </Form>
      </Card>
    </>
  );
}