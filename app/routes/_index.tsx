import { Button } from "@nextui-org/react";
import { Link, useLoaderData } from "@remix-run/react";
import electron from "~/electron.server";

export function loader() {
  return {
    userDataPath: electron.app.getPath("userData"),
  };
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <main>
      <h1>Welcome to Remix</h1>
      <p>User data path: {data.userDataPath}</p>
      <Link to={"/test"}>
        <Button variant="flat" size="sm" color="primary" isLoading={true}>
          Test page
        </Button>
      </Link>
    </main>
  );
}
