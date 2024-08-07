import {
  Button,
  SelectItem,
  TableCell,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useActionData,
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

import errorIllustration from "~/assets/animated/503-error-animate.svg";
import { ArrowLeftAnimated } from "~/components/icons/arrows";
import useSWR, { mutate } from "swr";
import { fetcher } from "~/data/api/departments";
import { API_BASE_URL } from "~/data/dotenv";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import SearchInput from "~/components/inputs/search";
import { UserInterface } from "~/utils/types";
import axios from "axios";
import PasswordInput from "~/components/inputs/password";
import { PlusIcon } from "~/components/icons/plus";
import { useEffect, useState } from "react";
import { DepartmentsCombobox } from "~/components/inputs/combobox";
import { errorToast, successToast } from "~/utils/toasters";

export default function AdminUserManagement() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { page, search_term } = useLoaderData<typeof loader>();

  const [storedValue] = useLocalStorage<any>("auth-token", "");

  //   handle form actions
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData) {
      if (!actionData.errors && actionData.status === "error") {
        errorToast(
          "Error",
          "An unexpected error occurred. Please try again..."
        );
      }

      if (actionData.status === "success") {
        successToast("Success", actionData.message);
        createUserDisclosure.onClose();
        editUserDisclosure.onClose();
        deleteUserDisclosure.onClose();
        mutate(
          `${API_BASE_URL}/api/users?page=${page}&search_term=${search_term}`
        );
      }
    }
  }, [actionData]);

  // table data
  const { data, isLoading } = useSWR(
    `${API_BASE_URL}/api/users?page=${page}&search_term=${search_term}`,
    fetcher(storedValue.token),
    {
      keepPreviousData: true,
    }
  );
  const loadingState = isLoading ? "loading" : "idle";
  // end:: table data

  //   create user stuff
  const createUserDisclosure = useDisclosure();
  const [key, setKey] = useState("");

  // edit user stuff
  const editUserDisclosure = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<UserInterface>();
  const [editKey, setEditKey] = useState("");
  useEffect(() => {
    if (!editUserDisclosure.isOpen) setEditKey("");
  }, [editUserDisclosure.onOpenChange]);

  // delete user stuff
  const deleteUserDisclosure = useDisclosure();
  const [deleteId, setDeleteId] = useState("");

  return (
    <main className="h-full flex flex-col gap-2">
      {/* table top */}
      <div className="flex items-center justify-between">
        <SearchInput />
        <Button
          color="primary"
          className="font-montserrat font-semibold w-max"
          onPress={() => createUserDisclosure.onOpen()}
          startContent={<PlusIcon />}
        >
          Create User
        </Button>
      </div>

      {/* users table */}
      <CustomTable
        columns={[
          "First Name",
          "Last Name",
          "Email",
          "Phone",
          "Role",
          "Actions",
        ]}
        page={page}
        setPage={(page) => navigate(`?page=${page}`)}
        totalPages={data?.data?.totalPages}
        loadingState={loadingState}
      >
        {data?.data?.users?.map((user: UserInterface, index: number) => (
          <TableRow key={index}>
            <TableCell>{user?.firstName}</TableCell>
            <TableCell>{user?.lastName}</TableCell>
            <TableCell>{user?.email}</TableCell>
            <TableCell>{user?.phone}</TableCell>
            <TableCell>{user?.role}</TableCell>
            <TableCell className="flex items-center gap-2">
              <EditButton
                action={() => {
                  setSelectedUser(user);
                  setEditKey(user?.department?._id as string);
                  editUserDisclosure.onOpen();
                }}
              />

              <DeleteButton
                action={() => {
                  setDeleteId(user?._id as string);
                  deleteUserDisclosure.onOpen();
                }}
              />
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
        actionText="Save Changes"
        size="xl"
        token={storedValue.token}
      >
        <div className="grid grid-cols-2 gap-6">
          <TextInput
            name="id"
            defaultValue={selectedUser?._id}
            className="hidden"
          />
          <TextInput
            name="firstName"
            label="First Name"
            isRequired
            defaultValue={selectedUser?.firstName}
            actionData={actionData}
          />
          <TextInput
            name="lastName"
            label="Last Name"
            isRequired
            defaultValue={selectedUser?.lastName}
            actionData={actionData}
          />
          <TextInput
            name="staffId"
            label="Staff ID"
            isRequired
            defaultValue={selectedUser?.staffId}
            actionData={actionData}
          />
          <TextInput
            name="position"
            label="Designation"
            isRequired
            defaultValue={selectedUser?.position}
            actionData={actionData}
          />
          <TextInput
            name="phone"
            label="Phone"
            type="tel"
            isRequired
            defaultValue={selectedUser?.phone}
            actionData={actionData}
          />
          <TextInput
            name="email"
            label="Email"
            type="email"
            isRequired
            defaultValue={selectedUser?.email}
            actionData={actionData}
          />
          <TextInput
            name="department"
            label="Department Combobox"
            value={editKey}
            isRequired
            className="hidden"
          />
          <DepartmentsCombobox
            token={storedValue.token}
            label="Department"
            value={editKey as string}
            setValue={setEditKey}
            isRequired
            actionData={actionData}
          />
          <CustomSelect
            name="role"
            label="User Role"
            isRequired
            defaultSelectedKeys={[selectedUser?.role]}
            actionData={actionData}
          >
            {[
              { key: "admin", value: "admin", display_name: "Admin" },
              { key: "support", value: "support", display_name: "Support" },
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
        token={storedValue.token}
      >
        <div className="grid grid-cols-2 gap-6">
          <TextInput
            name="firstName"
            label="First Name"
            isRequired
            actionData={actionData}
          />
          <TextInput
            name="lastName"
            actionData={actionData}
            label="Last Name"
            isRequired
          />
          <TextInput
            name="staffId"
            actionData={actionData}
            label="Staff ID"
            isRequired
          />
          <TextInput
            name="position"
            actionData={actionData}
            label="Designation"
            isRequired
          />
          <TextInput
            name="phone"
            actionData={actionData}
            label="Phone"
            type="tel"
            isRequired
          />
          <TextInput
            name="email"
            actionData={actionData}
            label="Email"
            type="email"
            isRequired
          />
          <TextInput
            name="department"
            value={key}
            isRequired
            className="hidden"
          />
          <DepartmentsCombobox
            token={storedValue.token}
            label="Department"
            value={key}
            setValue={setKey}
            name="dept"
            isRequired
          />
          <CustomSelect name="role" label="User Role" isRequired>
            {[
              { key: "admin", value: "admin", display_name: "Admin" },
              { key: "support", value: "support", display_name: "Support" },
              { key: "staff", value: "staff", display_name: "Staff" },
            ].map((role) => (
              <SelectItem key={role.key}>{role.display_name}</SelectItem>
            ))}
          </CustomSelect>
          <PasswordInput
            actionData={actionData}
            name="password"
            label="Password"
            isRequired
          />
        </div>
      </CreateRecordModal>

      {/* delete user modal */}
      <EditRecordModal
        onCloseModal={deleteUserDisclosure.onClose}
        onOpenChange={deleteUserDisclosure.onOpenChange}
        isOpen={deleteUserDisclosure.isOpen}
        intent="delete-user"
        title="Delete User Account"
        actionText="Delete"
        size="xl"
        token={storedValue.token}
      >
        <p className="font-nunito">
          Are you sure to delete this user account? This action cannot be
          undone!
        </p>
        <TextInput
          defaultValue={deleteId}
          name="id"
          className="hidden"
          label="Delete ID"
        />
      </EditRecordModal>
    </main>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData.entries());

  if (payload.intent === "create-user") {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/users/create`,
        {
          firstName: payload.firstName as string,
          lastName: payload.lastName as string,
          phone: payload.phone as string,
          department: payload.department as string,
          position: payload.position as string,
          staffId: payload.staffId as string,
          email: payload.email as string,
          password: payload.password as string,
          role: payload.role as string,
          photo: "",
        },
        {
          headers: {
            Authorization: `Bearer ${payload.token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.log(error);
      return {
        status: "error",
        message: error?.response?.statusText,
      };
    }
  }

  if (payload.intent === "edit-user") {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/users/update`,
        {
          id: payload.id as string,
          firstName: payload.firstName as string,
          lastName: payload.lastName as string,
          phone: payload.phone as string,
          department: payload.department as string,
          position: payload.position as string,
          staffId: payload.staffId as string,
          email: payload.email as string,
          password: payload.password as string,
          role: payload.role as string,
          photo: "",
        },
        {
          headers: {
            Authorization: `Bearer ${payload.token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.log(error);
      return {
        status: "error",
        message: error?.response?.statusText,
      };
    }
  }

  if (payload.intent === "delete-user") {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/users/delete/${payload.id}`,
        {
          headers: {
            Authorization: `Bearer ${payload.token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.log(error);
      return {
        status: "error",
        message: error?.response?.statusText,
      };
    }
  }

  return {};
};

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = (url.searchParams.get("search_term") as string) || "";

  console.log({ page, search_term });

  //throw new Error("error");

  return {
    page,
    search_term,
  };
};

export function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="pt-16  h-full">
        <div className="bg-red-500/10 h-full flex flex-col gap-6">
          <img
            src={errorIllustration}
            alt="Error Illustration"
            className="w-1/3"
          />
          <div>
            <h1 className="font-montserrat font-extrabold text-5xl text-red-500 text-center">
              {error.status} {error.statusText}
            </h1>
            <p className="font-nunito text-center text-lg">{error.data}</p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              color="danger"
              className="font-montserrat font-medium"
              onPress={() => navigate(-1)}
              size="sm"
              startContent={<ArrowLeftAnimated className="size-5" />}
            >
              Go Back
            </Button>
            <p className="font-nunito text-sm">
              Please contact the IT Team if the issue persists.
            </p>
          </div>
        </div>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className="pt-14 h-full">
        <div className="bg-red-500/10 dark:bg-red-500/15 rounded-2xl h-full overflow-y-auto vertical-scrollbar flex flex-col gap-6 items-center justify-center">
          <img
            src={errorIllustration}
            alt="Error Illustration"
            className="w-1/3"
          />
          <div>
            <h1 className="font-montserrat font-extrabold text-5xl text-red-500 text-center">
              Unexpected Error!
            </h1>
            <p className="font-nunito text-center text-lg line-clamp-2">
              {error.message}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              color="danger"
              className="font-montserrat font-medium"
              onPress={() => navigate(-1)}
              size="sm"
              startContent={<ArrowLeftAnimated className="size-5" />}
            >
              Go Back
            </Button>
            <p className="font-nunito text-sm">
              Please contact the IT Team if the issue persists.
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
