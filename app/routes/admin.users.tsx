import { Button, TableCell, TableRow, useDisclosure } from "@nextui-org/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  useLoaderData,
  useNavigate,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import CreateRecordModal from "~/components/modals/create";
import CustomTable from "~/components/sections/table";
import { UserInterface } from "~/utils/types";

export default function AdminUserManagement() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { page } = useLoaderData<typeof loader>();

  //   create user stuff
  const createUserDisclosure = useDisclosure();

  return (
    <main className="h-full flex flex-col gap-2">
      {/* table top */}
      <div className="flex items-center justify-end">
        <Button
          color="primary"
          className="font-nunito font-semibold w-max"
          onPress={() => createUserDisclosure.onOpen()}
        >
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

      {/* create user modal */}
      <CreateRecordModal
        onCloseModal={createUserDisclosure.onClose}
        onOpenChange={createUserDisclosure.onOpenChange}
        isOpen={createUserDisclosure.isOpen}
        intent="create-user"
        title="Create New User"
        actionText="Submit"
      ></CreateRecordModal>
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
