import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

export default function Test() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <main>
      <h1 className="font-black text-7xl text-violet-700">Hi, {user}</h1>
      <Link to={"/"}>Home</Link>
    </main>
  );
}

export const loader: LoaderFunction = () => {
  return {
    user: "Kwasi",
  };
};
