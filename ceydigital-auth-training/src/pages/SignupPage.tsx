import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { AuthLayout } from "../components/layout/AuthLayout";
import { validateSignup } from "../features/auth/validation";
import { useAuth } from "../context/AuthContext";
import type { ApiError } from "../features/auth/types";

const { Title, Text } = Typography;

type FormValues = {
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleFinish(values: FormValues) {
    const fieldErrors = validateSignup(values);
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
      await register(values.full_name, values.email, values.password);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      const apiError = err as ApiError;
      setServerError(apiError.message ?? "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      brandTitle="Ceydigital Auth Training"
      brandText="Create an account to explore the sign up, login, and dashboard flow."
    >
      <Card>
        <Title level={3}>Create Account</Title>

        {success && (
          <Alert
            style={{ marginBottom: 16 }}
            type="success"
            message="Account created. Redirecting…"
          />
        )}
        {serverError && (
          <Alert style={{ marginBottom: 16 }} type="error" message={serverError} />
        )}

        <Form form={form} layout="vertical" onFinish={handleFinish} disabled={submitting}>
          <Form.Item label="Full Name" name="full_name">
            <Input placeholder="Jane Doe" autoComplete="name" />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input placeholder="jane@example.com" autoComplete="email" />
          </Form.Item>

          <Form.Item label="Password" name="password">
            <Input.Password placeholder="At least 8 characters" autoComplete="new-password" />
          </Form.Item>

          <Form.Item label="Confirm Password" name="confirmPassword">
            <Input.Password placeholder="Repeat your password" autoComplete="new-password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={submitting}>
            {submitting ? "Creating account…" : "Create Account"}
          </Button>
        </Form>

        <Text style={{ display: "block", marginTop: 16 }}>
          Already have an account? <Link to="/login">Log in</Link>
        </Text>
      </Card>
    </AuthLayout>
  );
}