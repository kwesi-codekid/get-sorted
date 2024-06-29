import { Button, Progress } from "@nextui-org/react";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import electron from "~/electron.server";

export default function Index() {
  const navigate = useNavigate();
  const data = useLoaderData<typeof loader>();

  const [loading, setLoading] = useState<boolean>(false);
  const simulateNetworkLatency = () => {
    setLoading(true);
    // try {
    //   setLoading(true);
    //   const timeout = setTimeout(() => {
    //     console.log("dome");
    //   }, 3000);

    //   clearTimeout(timeout);
    // } catch (error) {
    //   console.log(error);
    // } finally {
    //   setLoading(false);
    //   navigate("/test");
    // }
  };
  return (
    <main>
      <h1>Welcome to Remix</h1>
      <p>User data path: {data.userDataPath}</p>
      <Button
        variant="flat"
        size="sm"
        color="primary"
        isLoading={loading}
        onClick={() => navigate("/test")}
      >
        Go to test
      </Button>
    </main>
  );
}

export function loader() {
  return {
    userDataPath: electron.app.getPath("userData"),
  };
}
