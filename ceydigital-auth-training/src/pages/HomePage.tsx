import { Link } from "react-router-dom";
import { Button, Space, Typography, Spin } from "antd";
import { useAuth } from "../context/AuthContext";

const { Title } = Typography;

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return <Spin style={{ display: "block", marginTop: 80 }} />;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      <Title>Ceydigital Auth Training</Title>
      <Space>
        {user ? (
          <Link to="/dashboard">
            <Button type="primary">Go to Dashboard</Button>
          </Link>
        ) : (
          <>
            <Link to="/login">
              <Button type="primary">Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign Up</Button>
            </Link>
          </>
        )}
      </Space>
    </div>
  );
}