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
import React, { useEffect, useRef, useState } from "react";
import { formatResponse } from "~/utils/string-manipulation";
import { errorToast, successToast } from "~/utils/toasters";
import { CommentInterface, TicketInterface } from "~/utils/types";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import moment from "moment";
import { ClipboardIcon } from "~/components/icons/clipboard";
import EditRecordModal from "~/components/modals/edit";
import TextInput from "~/components/inputs/text";
import CustomSelect from "~/components/inputs/select";
import { ChatBubble } from "~/components/sections/chat-bubble";
import useSWR, { mutate } from "swr";
import { fetcher } from "~/data/api/departments";

const ReactQuill =
  typeof window === "object" ? require("react-quill") : () => false;

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
        mutate(`${API_BASE_URL}/api/tickets/${ticket_id}`);
        setContent("");
      }
    }
  }, [actionData]);

  const { data, isLoading } = useSWR(
    `${API_BASE_URL}/api/tickets/${ticket_id}`,
    fetcher(storedValue.token),
    {
      keepPreviousData: true,
      refreshInterval: 1000,
    }
  );

  const [content, setContent] = useState("");
  const commentsRef = useRef<any>(null);

  useEffect(() => {
    if (commentsRef.current) {
      commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
    }
  }, [data?.data?.comments]);

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
            {data?.data?.ticket?.title}
          </h2>
        </Skeleton>
        <div className="grid gap-3">
          <p>
            Raised at:{" "}
            {moment(data?.data?.ticket?.createdAt).format("DD-MMM-YYYY hh:mm")}
          </p>
        </div>

        <div className="grid gap-3">
          <p>
            Reported by: {data?.data?.ticket?.reporter?.firstName}{" "}
            {data?.data?.ticket?.reporter?.lastName}
          </p>
          <p>
            Assigned to:{" "}
            {data?.data?.ticket?.assignee
              ? data?.data?.ticket?.assignee?.firstName +
                " " +
                data?.data?.ticket?.assignee?.lastName
              : "Unassigned"}
          </p>
          <div className="flex items-center">
            <p>Status: </p>
            <Chip
              color={
                data?.data?.ticket?.status === "open"
                  ? "danger"
                  : data?.data?.ticket?.status === "in-progress"
                  ? "warning"
                  : data?.data?.ticket?.status === "resolved"
                  ? "success"
                  : "primary"
              }
              size="sm"
              variant="flat"
            >
              {data?.data?.ticket?.status}
            </Chip>
          </div>
          <div className="flex items-center">
            <p>Priority: </p>
            <Chip
              size="sm"
              variant="flat"
              color={
                data?.data?.ticket?.priority === "low"
                  ? "success"
                  : data?.data?.ticket?.priority === "medium"
                  ? "primary"
                  : data?.data?.ticket?.priority === "high"
                  ? "warning"
                  : "danger"
              }
            >
              {data?.data?.ticket?.priority}
            </Chip>
          </div>
        </div>
      </div>

      {/* ticket comments */}
      <div className="dark:bg-slate-900 dark:border border-white/5 rounded-2xl p-3 pt-2 bg-white flex flex-col gap-4 col-span-2 justify-end">
        {/* comment list */}
        <div
          className="flex flex-col gap-4 h-[68vh] !overflow-y-auto vertical-scrollbar"
          ref={commentsRef}
        >
          {data?.data?.comments?.length > 0 ? (
            data?.data?.comments?.map((comment) => (
              <ChatBubble
                content={comment?.content}
                time={moment(comment?.createdAt).format("DD-MM-YYYY hh:mm")}
                author={
                  comment?.author?.firstName + " " + comment?.author?.lastName
                }
              />
            ))
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-xl font-nunito opacity-30">
                No comments yet...
              </p>
            </div>
          )}
        </div>

        {/* form */}
        <Form method="POST" id="add-comment" className="flex items-end gap-3">
          <TextInput
            name="intent"
            defaultValue="post-comment"
            className="hidden"
          />
          <TextInput
            name="author"
            defaultValue={storedValue?.user?._id}
            className="hidden"
          />
          <TextInput
            name="token"
            defaultValue={storedValue?.token}
            className="hidden"
          />
          <TextInput
            name="ticket"
            defaultValue={ticket_id}
            className="hidden"
          />

          <div className="w-full flex items-end gap-3">
            {/* comment quill */}
            <div className="pb-10 flex-1">
              <TextareaInput
                name="content"
                value={content}
                className="hidden"
              />
              <ReactQuill
                required
                value={content}
                onChange={setContent}
                className="h-24 !w-full !font-nunito"
              />
            </div>

            {/* post comment button */}
            <Button
              variant="solid"
              color="primary"
              type="submit"
              form="add-comment"
              startContent={<LoginAnimatedIcon className="text-4xl" />}
              className="font-nunito"
              isLoading={navigation.state === "submitting"}
            >
              Comment
            </Button>
          </div>
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

  if (formValues.intent === "post-comment") {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/comments/create`,
        {
          ticket: formValues.ticket,
          author: formValues.author,
          content: formValues.content,
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
