import { useEffect, useState } from "react";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { apiFetch } from "../api/client";
import { useAuth, type User as CtxUser } from "../context/AuthContext";
import type { User, ApiError } from "../features/auth/types";

const { Title } = Typography;

type FormValues = { full_name: string; email: string };

export default function ProfilePage() {
  const { setUser } = useAuth() as unknown as { setUser?: (u: CtxUser | null) => void };
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiFetch<{ user: User }>("/api/auth/me")
      .then((data) => form.setFieldsValue(data.user))
      .catch((err: ApiError) => setError(err.message))
      .finally(() => setLoading(false));
  }, [form]);

  async function handleFinish(values: FormValues) {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const data = await apiFetch<{ user: User }>("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify({ full_name: values.full_name }),
      });
      form.setFieldsValue(data.user);
      setUser?.(data.user);            // keep context in sync if exposed
      setSaved(true);
    } catch (err) {
      setError((err as ApiError).message ?? "Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Title level={2}>Profile</Title>
      <Card style={{ maxWidth: 480 }}>
        {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
        {saved && <Alert type="success" message="Saved" style={{ marginBottom: 16 }} />}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          disabled={loading || saving}
        >
          <Form.Item label="Email" name="email">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Full Name"
            name="full_name"
            rules={[{ required: true, min: 2 }]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={saving}>
            Save
          </Button>
        </Form>
      </Card>
    </>
  );
}