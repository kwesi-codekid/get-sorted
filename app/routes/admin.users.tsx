import {
  Button,
  SelectItem,
  TableCell,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { LoaderFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useNavigate,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import { DeleteOutlinedIcon } from "~/components/icons/delete";
import CustomSelect from "~/components/inputs/select";
import TextInput from "~/components/inputs/text";
import CreateRecordModal from "~/components/modals/create";
import EditRecordModal from "~/components/modals/edit";
import { DeleteButton, EditButton } from "~/components/sections/action-buttons";
import CustomTable from "~/components/sections/table";

export default function AdminUserManagement() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { page } = useLoaderData<typeof loader>();

  //   create user stuff
  const createUserDisclosure = useDisclosure();

  // edit user stuff
  const editUserDisclosure = useDisclosure();

  // delete user stuff
  const deleteUserDisclosure = useDisclosure();

  return (
    <main className="h-full flex flex-col gap-2">
      {/* table top */}
      <div className="flex items-center justify-end">
        <Button
          color="primary"
          className="font-montserrat font-semibold w-max"
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
        {[{ name: "Some" }].map((user: any) => (
          <TableRow>
            <TableCell>{"user?.firstName"}</TableCell>
            <TableCell>{"user?.firstName"}</TableCell>
            <TableCell>{"user?.firstName"}</TableCell>
            <TableCell>{"user?.firstName"}</TableCell>
            <TableCell className="flex items-center gap-2">
              <EditButton action={() => editUserDisclosure.onOpen()} />
              <DeleteButton action={() => editUserDisclosure.onOpen()} />
            </TableCell>
          </TableRow>
        ))}
      </CustomTable>

      {/* edit user modal */}
      <EditRecordModal
        onCloseModal={editUserDisclosure.onClose}
        onOpenChange={editUserDisclosure.onOpenChange}
        isOpen={editUserDisclosure.isOpen}
        intent="edit-user"
        title="Update User Info"
        actionText="Submit"
        size="xl"
      >
        <div className="grid grid-cols-2 gap-6">
          <TextInput name="firstName" label="First Name" isRequired />
          <TextInput name="lastName" label="Last Name" isRequired />
          <TextInput name="staffId" label="Staff ID" isRequired />
          <TextInput name="position" label="Designation" isRequired />
          <TextInput name="phone" label="Phone" type="tel" isRequired />
          <TextInput name="email" label="Email" type="email" isRequired />
          <TextInput name="department" label="Department" isRequired />
          <CustomSelect name="role" label="User Role" isRequired>
            {[
              { key: "admin", value: "admin", display_name: "Admin" },
              { key: "staff", value: "staff", display_name: "Staff" },
            ].map((role) => (
              <SelectItem key={role.key}>{role.display_name}</SelectItem>
            ))}
          </CustomSelect>
        </div>
      </EditRecordModal>

      {/* create user modal */}
      <CreateRecordModal
        onCloseModal={createUserDisclosure.onClose}
        onOpenChange={createUserDisclosure.onOpenChange}
        isOpen={createUserDisclosure.isOpen}
        intent="create-user"
        title="Create New User"
        actionText="Submit"
        size="xl"
      >
        <div className="grid grid-cols-2 gap-6">
          <TextInput name="firstName" label="First Name" isRequired />
          <TextInput name="lastName" label="Last Name" isRequired />
          <TextInput name="staffId" label="Staff ID" isRequired />
          <TextInput name="position" label="Designation" isRequired />
          <TextInput name="phone" label="Phone" type="tel" isRequired />
          <TextInput name="email" label="Email" type="email" isRequired />
          <TextInput name="department" label="Department" isRequired />
          <CustomSelect name="role" label="User Role" isRequired>
            {[
              { key: "admin", value: "admin", display_name: "Admin" },
              { key: "staff", value: "staff", display_name: "Staff" },
            ].map((role) => (
              <SelectItem key={role.key}>{role.display_name}</SelectItem>
            ))}
          </CustomSelect>
        </div>
      </CreateRecordModal>
    </main>
  );
}

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = url.searchParams.get("search_term") as string;

  console.log({ page, search_term });

  //throw new Error("error");

  return {
    page,
    search_term,
  };
};

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="pt-16  h-full">
        <div className="bg-red-500/10 h-full">
          <h1>
            {error.status} {error.statusText}
          </h1>
          <p>{error.data}</p>
        </div>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className="pt-16 h-full">
        <div className="bg-red-500/10 h-full">
          <h1>Error</h1>
          <p>{error.message}</p>
          <p>The stack trace is:</p>
          <pre className="!text-wrap">{error.stack}</pre>
        </div>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}