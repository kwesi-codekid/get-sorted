import {
  Button,
  Chip,
  SelectItem,
  Skeleton,
  useDisclosure,
} from "@nextui-org/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

import errorIllustration from "~/assets/animated/503-error-animate.svg";
import { ArrowLeftAnimated } from "~/components/icons/arrows";
import { API_BASE_URL } from "~/data/dotenv";
import TextareaInput from "~/components/inputs/textarea";
import axios from "axios";
import { Card } from "~/components/sections/cards";
import { LoginAnimatedIcon } from "~/components/icons/open";
import { ThreeDotsBounceIcon } from "~/components/icons/chat";
import React, { useEffect, useState } from "react";
import { formatResponse } from "~/utils/string-manipulation";
import { errorToast, successToast } from "~/utils/toasters";
import { TicketInterface } from "~/utils/types";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import moment from "moment";
import { ClipboardIcon } from "~/components/icons/clipboard";
import EditRecordModal from "~/components/modals/edit";
import TextInput from "~/components/inputs/text";
import CustomSelect from "~/components/inputs/select";

export default function AdminTicketInfo() {
  const navigate = useNavigate();
  const { ticket_id } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
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
        changeStatusDisclosure.onClose();
        fetchTicketDetails(ticket_id, storedValue.token);
      }
    }
  }, [actionData]);

  const [isLoading, setIsLoading] = useState(false);
  const [ticketInfo, setTicketInfo] = useState<{
    comments: any[];
    ticket: TicketInterface;
  }>();
  const fetchTicketDetails = async (ticket_id: string, token: string) => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/api/tickets/${ticket_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTicketInfo(response.data?.data);
    } catch (error: any) {
      errorToast(
        error?.message,
        "An error occurred while fetching ticket details..."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails(ticket_id, storedValue.token);
  }, []);

  // change ticket status stuff
  const changeStatusDisclosure = useDisclosure();

  return (
    <main className="h-full grid grid-cols-3 gap-6">
      <div className="dark:bg-slate-900 dark:border border-white/5 rounded-2xl p-3 bg-white flex flex-col gap-4 h-max">
        <Button
          size="sm"
          variant="flat"
          color="default"
          startContent={<ArrowLeftAnimated className="size-3.5" />}
          onClick={() => navigate("/admin/tickets")}
          className="w-max font-nunito"
        >
          Back to tickets
        </Button>
        <Skeleton isLoaded={!isLoading}>
          <h2 className="font-montserrat text-2xl font-semibold">
            {ticketInfo?.ticket?.title}
          </h2>
        </Skeleton>
        <div>
          <p>
            Raised at:{" "}
            {moment(ticketInfo?.ticket?.createdAt).format("DD-MMM-YYYY hh:mm")}
          </p>
        </div>

        <div>
          <p>
            Reported by: {ticketInfo?.ticket?.reporter?.firstName}{" "}
            {ticketInfo?.ticket?.reporter?.lastName}
          </p>
          <p>
            Assigned to:{" "}
            {ticketInfo?.ticket?.assignee
              ? ticketInfo?.ticket?.assignee?.firstName +
                " " +
                ticketInfo?.ticket?.assignee?.lastName
              : "Unassigned"}
          </p>
          <div className="flex items-center">
            <p>Status: </p>
            <Chip
              color={
                ticketInfo?.ticket?.status === "open"
                  ? "danger"
                  : ticketInfo?.ticket?.status === "in-progress"
                  ? "warning"
                  : ticketInfo?.ticket?.status === "resolved"
                  ? "success"
                  : "primary"
              }
              size="sm"
              variant="flat"
            >
              {ticketInfo?.ticket?.status}
            </Chip>
          </div>
          <div className="flex items-center">
            <p>Priority: </p>
            <Chip
              size="sm"
              variant="flat"
              color={
                ticketInfo?.ticket?.priority === "low"
                  ? "success"
                  : ticketInfo?.ticket?.priority === "medium"
                  ? "primary"
                  : ticketInfo?.ticket?.priority === "high"
                  ? "warning"
                  : "danger"
              }
            >
              {ticketInfo?.ticket?.priority}
            </Chip>
          </div>
        </div>

        {/* change status button */}
        <Button
          variant="flat"
          color="success"
          startContent={<ClipboardIcon className="size-6" />}
          onClick={() => changeStatusDisclosure.onOpen()}
          className="w-max font-nunito"
        >
          Change Ticket Status
        </Button>
      </div>

      {/* ticket comments */}
      <div className="dark:bg-slate-900 dark:border border-white/5 rounded-2xl p-3 pt-2 bg-white flex flex-col gap-4 col-span-2 justify-end">
        <Form method="POST" id="ask-ai" className="flex items-end gap-3">
          <TextareaInput
            variant="flat"
            classNames={{
              inputWrapper:
                "bg-white dark:bg-slate-800 dark:border border-white/5",
              base: "font-nunito",
            }}
            aria-labelledby="prompt"
            name="prompt"
          />
          <Button
            variant="solid"
            color="primary"
            type="submit"
            form="ask-ai"
            startContent={<LoginAnimatedIcon className="text-4xl" />}
            className="font-nunito"
          >
            Submit
          </Button>
        </Form>
      </div>

      {/* change ticket status modal */}
      <EditRecordModal
        onCloseModal={changeStatusDisclosure.onClose}
        onOpenChange={changeStatusDisclosure.onOpenChange}
        isOpen={changeStatusDisclosure.isOpen}
        intent="change-status"
        title="Change Ticket Status"
        actionText="Save Changes"
        size="md"
        token={storedValue.token}
      >
        <TextInput
          defaultValue={ticket_id}
          className="hidden"
          name="id"
          label="Ticket ID"
        />
        <CustomSelect
          name="status"
          label="Status"
          isRequired
          actionData={actionData}
        >
          {[
            {
              key: "open",
              value: "open",
              display_name: "Open",
            },
            {
              key: "in-progress",
              value: "in-progress",
              display_name: "In Progress",
            },
            {
              key: "resolved",
              value: "resolved",
              display_name: "Resolved",
            },
            {
              key: "closed",
              value: "closed",
              display_name: "Closed",
            },
          ].map((role) => (
            <SelectItem key={role.key}>{role.display_name}</SelectItem>
          ))}
        </CustomSelect>
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

  if (formValues.intent === "change-status") {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/tickets/change-status`,
        {
          id: formValues.id,
          status: formValues.status,
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

  return {};
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { ticket_id } = params;

  return {
    ticket_id,
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
