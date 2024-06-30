import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import CustomTable from "~/components/sections/table";

export default function AdminUserManagement() {
  const { page, search_term } = useLoaderData<typeof loader>();

  console.log(search_term);

  return (
    <main className="h-full flex flex-col gap-6">
      {/* table top */}

      {/* users table */}
      {/* <CustomTable>

            </CustomTable> */}
    </main>
  );
}

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = url.searchParams.get("search_term") as string;

  return {
    page,
    search_term,
  };
};
