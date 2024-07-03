import { Button, TableCell, TableRow, useDisclosure } from "@nextui-org/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import TextInput from "~/components/inputs/text";
import CreateRecordModal from "~/components/modals/create";
import EditRecordModal from "~/components/modals/edit";
import { DeleteButton, EditButton } from "~/components/sections/action-buttons";
import CustomTable from "~/components/sections/table";

import errorIllustration from "~/assets/animated/503-error-animate.svg";
import { ArrowLeftAnimated } from "~/components/icons/arrows";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { API_BASE_URL } from "~/data/dotenv";
import { fetcher } from "~/data/api/departments";
import useSWR, { mutate } from "swr";
import { DepartmentInterface } from "~/utils/types";
import TextareaInput from "~/components/inputs/textarea";
import SearchInput from "~/components/inputs/search";
import axios from "axios";
import { useEffect, useState } from "react";
import { errorToast, successToast } from "~/utils/toasters";

export default function AdminDepartmentManagement() {
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
          "An error occurred while logging you in. Please try again..."
        );
      }

      if (actionData.status === "success") {
        successToast("Success", actionData.message);
        createDisclosure.onClose();
        editDisclosure.onClose();
        deleteDisclosure.onClose();
        mutate(
          `${API_BASE_URL}/api/departments?page=${page}&search_term=${search_term}`
        );
      }
    }
  }, [actionData]);

  // table data
  const { data, isLoading } = useSWR(
    `${API_BASE_URL}/api/departments?page=${page}&search_term=${search_term}`,
    fetcher(storedValue.token),
    {
      keepPreviousData: true,
    }
  );
  const loadingState = isLoading ? "loading" : "idle";

  //   create department stuff
  const createDisclosure = useDisclosure();

  // edit department stuff
  const editDisclosure = useDisclosure();
  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentInterface>();

  // delete department stuff
  const deleteDisclosure = useDisclosure();
  const [deleteId, setDeleteId] = useState("");

  return (
    <main className="h-full flex flex-col gap-2">
      {/* table top */}
      <div className="flex items-center justify-between">
        <SearchInput />
        <Button
          color="primary"
          className="font-montserrat font-semibold w-max"
          onPress={() => createDisclosure.onOpen()}
        >
          New Department
        </Button>
      </div>

      {/* departments table */}
      <CustomTable
        columns={["Name", "Description", "Phone", "Actions"]}
        page={page}
        setPage={(page) => navigate(`?page=${page}`)}
        totalPages={data?.totalPages || 1}
        loadingState={loadingState}
      >
        {data?.departments?.map(
          (department: DepartmentInterface, index: number) => (
            <TableRow key={index}>
              <TableCell>{department?.name}</TableCell>
              <TableCell>{department?.description}</TableCell>
              <TableCell>{department?.phone}</TableCell>
              <TableCell className="flex items-center gap-2">
                <EditButton
                  action={() => {
                    setSelectedDepartment(department);
                    editDisclosure.onOpen();
                  }}
                />
                <DeleteButton
                  action={() => {
                    setDeleteId(department?._id as string);
                    deleteDisclosure.onOpen();
                  }}
                />
              </TableCell>
            </TableRow>
          )
        )}
      </CustomTable>

      {/* edit department modal */}
      <EditRecordModal
        onCloseModal={editDisclosure.onClose}
        onOpenChange={editDisclosure.onOpenChange}
        isOpen={editDisclosure.isOpen}
        intent="edit-department"
        title="Update Department Info"
        actionText="Save Changes"
        size="xl"
        token={storedValue.token}
      >
        <div className="grid grid-cols-1 gap-6">
          <TextInput
            defaultValue={selectedDepartment?._id}
            name="_id"
            label="Department ID"
            isRequired
            className="hidden"
          />
          <TextInput
            defaultValue={selectedDepartment?.name}
            name="name"
            label="Department Name"
            isRequired
            actionData={actionData}
          />
          <TextareaInput
            defaultValue={selectedDepartment?.description}
            name="description"
            label="Description"
            isRequired
            actionData={actionData}
          />
          <TextInput
            defaultValue={selectedDepartment?.phone}
            name="phone"
            label="Phone"
            isRequired
            actionData={actionData}
          />
        </div>
      </EditRecordModal>

      {/* create department modal */}
      <CreateRecordModal
        onCloseModal={createDisclosure.onClose}
        onOpenChange={createDisclosure.onOpenChange}
        isOpen={createDisclosure.isOpen}
        intent="create-department"
        title="Create New Department"
        actionText="Submit"
        size="md"
        token={storedValue.token}
      >
        <div className="grid grid-cols-1 gap-6">
          <TextInput
            actionData={actionData}
            name="name"
            label="Department Name"
            isRequired
          />
          <TextareaInput
            actionData={actionData}
            name="description"
            label="Description"
            isRequired
          />
          <TextInput
            actionData={actionData}
            name="phone"
            label="Phone"
            isRequired
          />
        </div>
      </CreateRecordModal>

      {/* delete department modal */}
      <EditRecordModal
        onCloseModal={deleteDisclosure.onClose}
        onOpenChange={deleteDisclosure.onOpenChange}
        isOpen={deleteDisclosure.isOpen}
        intent="delete-department"
        title="Delete Department"
        actionText="Delete"
        size="xl"
        token={storedValue.token}
      >
        <p className="font-nunito">Are you sure to delete this user account?</p>
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
  const formValues = Object.fromEntries(formData.entries());

  if (formValues.intent === "create-department") {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/departments/create`,
        {
          name: formValues.name,
          description: formValues.description,
          phone: formValues.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${formValues.token}`,
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

  if (formValues.intent === "edit-department") {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/departments/update`,
        {
          id: formValues._id,
          name: formValues.name,
          description: formValues.description,
          phone: formValues.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${formValues.token}`,
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

  if (formValues.intent === "delete-department") {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/departments/delete/${formValues.id}`,
        {
          headers: {
            Authorization: `Bearer ${formValues.token}`,
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

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = (url.searchParams.get("search_term") as string) || "";

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
