import {
  Button,
  Chip,
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
import { DepartmentInterface, TicketInterface } from "~/utils/types";
import TextareaInput from "~/components/inputs/textarea";
import SearchInput from "~/components/inputs/search";
import axios from "axios";
import { useEffect, useState } from "react";
import { errorToast, successToast } from "~/utils/toasters";
import moment from "moment";
import { UserAnimated } from "~/components/icons/user";
import { LoginAnimatedIcon } from "~/components/icons/open";
import CustomSelect from "~/components/inputs/select";
import { PlusIcon } from "~/components/icons/plus";
import { SupportUsersCombobox } from "~/components/inputs/combobox";

export default function AdminTicketManagement() {
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
        assignDisclosure.onClose();
        mutate(
          `${API_BASE_URL}/api/tickets?page=${page}&search_term=${search_term}`
        );
      }
    }
  }, [actionData]);

  // table data
  const { data, isLoading } = useSWR(
    `${API_BASE_URL}/api/tickets?page=${page}&search_term=${search_term}`,
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

  // assign ticket stuff
  const assignDisclosure = useDisclosure();
  const [assigneeKey, setAssigneeKey] = useState("");
  const [ticketId, setTicketId] = useState("");

  return (
    <main className="h-full flex flex-col gap-2">
      {/* table top */}
      <div className="flex items-center justify-between">
        <SearchInput />
        <Button
          color="primary"
          className="font-montserrat font-semibold w-max"
          onPress={() => createDisclosure.onOpen()}
          startContent={<PlusIcon />}
        >
          Raise Ticket
        </Button>
      </div>

      {/* departments table */}
      <CustomTable
        columns={[
          "Timestamp",
          "Title",
          "Reporter",
          "Priority",
          "Status",
          "Assignee",
          "Actions",
        ]}
        page={page}
        setPage={(page) => navigate(`?page=${page}`)}
        totalPages={data?.totalPages || 1}
        loadingState={loadingState}
      >
        {data?.data?.tickets?.map((ticket: TicketInterface, index: number) => (
          <TableRow key={index}>
            <TableCell className="text-xs">
              {moment(ticket?.createdAt).format("DD-MM-YYYY hh:mm")}
            </TableCell>
            <TableCell className="text-xs">{ticket?.title}</TableCell>
            <TableCell className="text-xs">
              {ticket?.reporter?.firstName} {ticket?.reporter?.lastName}
            </TableCell>

            <TableCell className="text-xs">
              <Chip
                size="sm"
                variant="dot"
                color={
                  ticket?.priority === "low"
                    ? "success"
                    : ticket?.priority === "medium"
                    ? "primary"
                    : ticket?.priority === "high"
                    ? "warning"
                    : "danger"
                }
                classNames={{
                  base:
                    ticket?.priority === "low"
                      ? "border-[#17c964]"
                      : ticket?.priority === "medium"
                      ? "border-[#006fee]"
                      : ticket?.priority === "high"
                      ? "border-[#f5a524]"
                      : "border-[#f31260]",
                }}
              >
                {ticket?.priority}
              </Chip>
            </TableCell>
            <TableCell className="text-xs">
              <Chip
                color={
                  ticket?.status === "open"
                    ? "danger"
                    : ticket?.status === "in-progress"
                    ? "warning"
                    : ticket?.status === "resolved"
                    ? "success"
                    : "primary"
                }
                size="sm"
                variant="flat"
              >
                {ticket?.status}
              </Chip>
            </TableCell>
            <TableCell className="text-xs">
              {ticket?.assignee
                ? ticket?.assignee?.firstName + " " + ticket?.assignee?.lastName
                : "Unassigned"}
            </TableCell>
            <TableCell className="flex items-center gap-2">
              <Button
                size="sm"
                variant="flat"
                color="success"
                startContent={<LoginAnimatedIcon className="size-3.5" />}
                onPress={() => {
                  navigate(`/admin/tickets/${ticket._id}`);
                }}
              >
                Open
              </Button>
              <Button
                size="sm"
                variant="flat"
                color="primary"
                startContent={<UserAnimated className="size-3.5" />}
                onPress={() => {
                  setTicketId(ticket?._id);
                  if (ticket?.assignee) {
                    setAssigneeKey(ticket?.assignee?._id as string);
                  }
                  assignDisclosure.onOpen();
                }}
              >
                {!ticket?.assignee ? "Assign" : "Reassign"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
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
        intent="raise-ticket"
        title="Raise New  Ticket"
        actionText="Submit"
        size="md"
        token={storedValue.token}
      >
        <div className="grid grid-cols-1 gap-6">
          <TextInput
            actionData={actionData}
            className="hidden"
            name="reporter"
            label="Reporter"
            isRequired
            value={storedValue?.user?._id}
          />
          <TextInput
            actionData={actionData}
            name="title"
            label="Title"
            isRequired
          />
          <TextareaInput
            actionData={actionData}
            name="description"
            label="Description"
          />
          <CustomSelect
            name="priority"
            label="Priority"
            isRequired
            actionData={actionData}
          >
            {[
              {
                key: "low",
                value: "low",
                display_name: "Low",
              },
              {
                key: "medium",
                value: "medium",
                display_name: "Medium",
              },
              {
                key: "high",
                value: "high",
                display_name: "High",
              },
              {
                key: "urgent",
                value: "urgent",
                display_name: "Urgent",
              },
            ].map((role) => (
              <SelectItem key={role.key}>{role.display_name}</SelectItem>
            ))}
          </CustomSelect>
        </div>
      </CreateRecordModal>

      {/* assign ticket modal */}
      <EditRecordModal
        onCloseModal={assignDisclosure.onClose}
        onOpenChange={assignDisclosure.onOpenChange}
        isOpen={assignDisclosure.isOpen}
        intent="assign-ticket"
        title="Assign Ticket"
        actionText="Assign"
        size="md"
        token={storedValue.token}
      >
        <TextInput
          defaultValue={ticketId}
          className="hidden"
          name="id"
          label="Ticket ID"
        />
        <TextInput
          name="assignee"
          className="hidden"
          label="Assignee"
          value={assigneeKey}
        />
        <SupportUsersCombobox
          label="Assignee Combobox"
          value={assigneeKey}
          setValue={setAssigneeKey}
          token={storedValue?.token}
        />
      </EditRecordModal>
    </main>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());

  if (formValues.intent === "raise-ticket") {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/tickets/create`,
        {
          title: formValues.title,
          description: formValues.description,
          priority: formValues.priority,
          reporter: formValues.reporter,
          files: "[]",
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

  if (formValues.intent === "assign-ticket") {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/tickets/assign`,
        {
          id: formValues.id,
          assignee: formValues.assignee,
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
