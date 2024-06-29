import { Button } from "@nextui-org/react";
import { ActionFunction } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import PasswordInput from "~/components/inputs/password";
import TextInput from "~/components/inputs/text";
import { ActionDataInterface } from "~/utils/types";

export default function Login() {
  const navigation = useNavigation();

  //   handle form actions
  const actionData = useActionData<typeof action>();

  return (
    <div className="h-screen grid grid-cols-2 gap-8">
      {/* login form */}
      <div className="h-full flex flex-col gap-8 items-center justify-center">
        <div className="w-3/5 flex flex-col gap-8">
          <h2 className="font-montserrat font-bold text-4xl">
            Login To Your Dashboard
          </h2>

          <Form
            method="POST"
            id="login-form"
            className="pr-12 flex flex-col gap-6"
          >
            <TextInput label="Email" name="email" actionData={actionData} />
            <PasswordInput
              label="Password"
              name="password"
              actionData={actionData}
            />
            <Button
              type="submit"
              form="login-form"
              isLoading={navigation.state === "submitting"}
              color="primary"
              className="font-nunito font-bold"
            >
              Submit
            </Button>
          </Form>
        </div>
      </div>

      {/* placeholder content */}
      <div className="h-full bg-blue-600"></div>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());

  console.log(formValues);

  const errors: ActionDataInterface = {
    status: "error",
    message: "Invalid inputs provided",
    errors: [
      { field: "email", message: "Invalid email provided" },
      { field: "password", message: "Invalid password provided" },
    ],
  };

  return {
    errors,
  };
};
