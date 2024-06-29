import { Link } from "@remix-run/react";

export default function Test() {
  return (
    <main>
      <h1 className="font-black text-7xl text-violet-700">
        this is a test page
      </h1>
      <Link to={"/"}>Home</Link>
    </main>
  );
}
