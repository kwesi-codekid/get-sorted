import { Button, Card, Link } from "@nextui-org/react";
import { ActionFunction } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useActionData,
  useNavigate,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import { useEffect } from "react";
import { ArrowLeftAnimated } from "~/components/icons/arrows";
import PasswordInput from "~/components/inputs/password";
import TextInput from "~/components/inputs/text";
import { login } from "~/data/api/auth";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { errorToast } from "~/utils/toasters";
import errorIllustration from "~/assets/animated/503-error-animate.svg";

export default function Login() {
  const navigation = useNavigation();
  const navigate = useNavigate();

  const [storedValue, setValue] = useLocalStorage("auth-token", undefined);

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
        setValue(actionData.data);
        navigate(`/${actionData.data.user.role}`);
      }
    }
  }, [actionData]);

  return (
    <div className="h-screen grid grid-cols-2 gap-8 bg-[url('assets/images/black-background-texture.jpeg')] bg-cover bg-no-repeat bg-center">
      {/* placeholder content */}
      <div className="h-full bg-transparent"></div>

      {/* login form */}
      <div className="h-full flex flex-col gap-8 items-center justify-center">
        <Card className="w-3/5 rounded-3xl flex flex-col gap-8 backdrop-blur-lg bg-[#18181b] pt-8 px-8 pb-12 border border-white/5">
          <h2 className="font-montserrat font-bold text-4xl text-white">
            Login To Your Dashboard
          </h2>

          <Form method="POST" id="login-form" className="flex flex-col gap-8">
            <TextInput
              label="Email"
              name="email"
              actionData={actionData}
              classNames={{
                label: "text-white font-sen font-semibold",
                base: "shadow-none",
                inputWrapper: "border-gray-600 text-white font-nunito",
                errorMessage: "font-nunito",
              }}
              type="email"
              isRequired
            />
            <PasswordInput
              label="Password"
              name="password"
              actionData={actionData}
              classNames={{
                label: "text-white font-sen font-semibold",
                base: "shadow-none",
                inputWrapper: "border-gray-600 text-white font-nunito",
                errorMessage: "font-nunito",
              }}
              isRequired
            />
            <div className="flex items-center justify-end">
              <Link
                onPress={() => navigate("/admin")}
                className="font-nunito text-right cursor-pointer"
              >
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              form="login-form"
              isLoading={navigation.state === "submitting"}
              color="primary"
              className="font-montserrat font-medium"
            >
              Submit
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());

  const response = await login({
    email: formValues.email as string,
    password: formValues.password as string,
  });

  return response;
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
