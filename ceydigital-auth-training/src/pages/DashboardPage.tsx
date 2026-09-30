import { Card, Typography } from "antd";
import { useAuth } from "../context/AuthContext";

const { Title, Text } = Typography;

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <Title level={2}>Welcome, {user!.full_name}</Title>
      <Card title="Account">
        <Text>Email: {user!.email}</Text>
      </Card>
    </>
  );
}