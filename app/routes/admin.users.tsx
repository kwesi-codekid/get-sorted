import { Button, TableCell, TableRow } from "@nextui-org/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  useLoaderData,
  useNavigate,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import CustomTable from "~/components/sections/table";
import { UserInterface } from "~/utils/types";

export default function AdminUserManagement() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { page } = useLoaderData<typeof loader>();

  return (
    <main className="h-full flex flex-col gap-2">
      {/* table top */}
      <div className="flex items-center justify-end">
        <Button color="primary" className="font-nunito font-semibold w-max">
          Create User
        </Button>
      </div>

      {/* users table */}
      <CustomTable
        columns={["First Name", "Last Name", "Email", "Phone", "Actions"]}
        page={page}
        setPage={(page) => navigate(`?page=${page}`)}
        totalPages={3}
        loadingState={navigation.state === "loading" ? "loading" : "idle"}
      >
        {[].map((user: UserInterface) => (
          <TableRow>
            <TableCell>{user?.firstName}</TableCell>
            <TableCell>{user?.firstName}</TableCell>
            <TableCell>{user?.firstName}</TableCell>
          </TableRow>
        ))}
      </CustomTable>
    </main>
  );
}

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = url.searchParams.get("search_term") as string;

  console.log({ page, search_term });

  return {
    page,
    search_term,
  };
};
