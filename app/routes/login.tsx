import { Button, Card, Link } from "@nextui-org/react";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { useEffect } from "react";
import PasswordInput from "~/components/inputs/password";
import TextInput from "~/components/inputs/text";
import { login } from "~/data/api/auth";
import { fetchCurrentUser } from "~/data/api/user";
import { commitSession, getSession } from "~/electron.server";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { errorToast, successToast } from "~/utils/toasters";
import { ActionDataInterface, UserInterface } from "~/utils/types";

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
