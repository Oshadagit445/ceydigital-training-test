import { Link } from "react-router-dom";
import { Button, Result } from "antd";

export default function NotFoundPage() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Page not found."
      extra={
        <Link to="/">
          <Button type="primary">Go Home</Button>
        </Link>
      }
    />
  );
}