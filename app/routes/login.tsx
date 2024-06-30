import { Button, Card, Link } from "@nextui-org/react";
import { ActionFunction } from "@remix-run/node";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import PasswordInput from "~/components/inputs/password";
import TextInput from "~/components/inputs/text";
import { ActionDataInterface } from "~/utils/types";

export default function Login() {
  const navigation = useNavigation();
  const navigate = useNavigate();

  //   handle form actions
  const actionData = useActionData<typeof action>();

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
                inputWrapper: "border-gray-600",
                errorMessage: "font-nunito",
              }}
            />
            <PasswordInput
              label="Password"
              name="password"
              actionData={actionData}
              classNames={{
                label: "text-white font-sen font-semibold",
                base: "shadow-none",
                inputWrapper: "border-gray-600",
                errorMessage: "font-nunito",
              }}
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
