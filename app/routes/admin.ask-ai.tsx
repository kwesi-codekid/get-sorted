import { Button } from "@nextui-org/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useActionData,
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

export default function StaffAskAI() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const [formattedSections, setFormattedSections] = useState<any>();
  useEffect(() => {
    if (actionData) {
      const formatted = formatResponse(actionData);
      setFormattedSections(formatted);
    }
  }, [actionData]);

  return (
    <main className="h-full flex flex-col gap-8">
      <Card
        title="Response"
        wrapperClasses="h-[75vh] overflow-y-auto vertical-scrollbar"
        bodyClasses={`overflow-y-auto vertical-scrollbar flex-1 ${
          navigation.state === "submitting"
            ? "flex items-center justify-center flex-col gap-4"
            : ""
        }`}
      >
        {navigation.state === "submitting" ? (
          <div className="flex flex-col gap-5 items-center">
            <ThreeDotsBounceIcon className="text-5xl text-blue-600" />
            <h4 className="font-nunito text-2xl text-center">
              Generating response...
            </h4>
          </div>
        ) : (
          <div className="font-nunito">
            {actionData &&
              formattedSections?.map((section: any, index: number) => (
                <React.Fragment key={index}>{section}</React.Fragment>
              ))}
          </div>
        )}
      </Card>

      <Form method="POST" id="ask-ai" className="flex items-end gap-6">
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
          size="lg"
          variant="solid"
          color="primary"
          type="submit"
          form="ask-ai"
          startContent={<LoginAnimatedIcon />}
          className="font-nunito"
        >
          Submit
        </Button>
      </Form>
    </main>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());

  try {
    const apiKey = "AIzaSyC_0TEHGdldMHXgaDyoCXmiZoJXDcEGv9g";
    const genAI = new GoogleGenerativeAI(apiKey as string);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    async function run() {
      const parts = [
        {
          text: "You are a support assist in an organization using a dedicated helpdesk ticketing software. Your job is to provide accurate, concise assistance and suggestions to problems being faced by the staff within the organization. Almost all the staff uses Windows PC. If there's the need to contact the IT Department, they should call on +233594213496",
        },
        {
          text: `input: ${formValues.prompt}`,
        },
        { text: "output: " },
      ];

      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
      });
      return result.response.text();
    }

    return run();
  } catch (error) {
    console.error(error);
    return { error };
  }
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
