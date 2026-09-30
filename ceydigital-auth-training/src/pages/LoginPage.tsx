import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { AuthLayout } from "../components/layout/AuthLayout";
import { validateLogin } from "../features/auth/validation";
import { useAuth } from "../context/AuthContext";
import type { ApiError } from "../features/auth/types";

const { Title, Text } = Typography;

type FormValues = { email: string; password: string };

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleFinish(values: FormValues) {
    const fieldErrors = validateLogin(values);
    if (Object.keys(fieldErrors).length > 0) {
      form.setFields(
        Object.entries(fieldErrors).map(([name, error]) => ({
          name,
          errors: [error],
        }))
      );
      return;
    }

    setServerError(null);
    setSubmitting(true);
    try {
      await login(values.email, values.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const apiError = err as ApiError;
      setServerError(apiError.message ?? "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      brandTitle="Ceydigital Auth Training"
      brandText="Sign in to continue to your dashboard."
    >
      <Card>
        <Title level={3}>Log In</Title>

        {serverError && (
          <Alert style={{ marginBottom: 16 }} type="error" message={serverError} />
        )}

        <Form form={form} layout="vertical" onFinish={handleFinish} disabled={submitting}>
          <Form.Item label="Email" name="email">
            <Input placeholder="jane@example.com" autoComplete="email" />
          </Form.Item>

          <Form.Item label="Password" name="password">
            <Input.Password placeholder="Your password" autoComplete="current-password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={submitting}>
            {submitting ? "Signing in…" : "Sign In"}
          </Button>
        </Form>

        <Text style={{ display: "block", marginTop: 16 }}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </Text>
      </Card>
    </AuthLayout>
  );
}