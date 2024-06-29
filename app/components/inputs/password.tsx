import { Input, InputProps } from "@nextui-org/react";
import { useState } from "react";
import { EyeFilled, EyeSlashFilled } from "../icons/eye";

export default function PasswordInput(props: InputProps) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <Input
      color="primary"
      labelPlacement="outside"
      placeholder=" "
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? (
            <EyeSlashFilled className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <EyeFilled className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
      variant="bordered"
      classNames={{
        label: "font-sen font-semibold text-slate-700 dark:text-white",
        base: "shadow-none font-nunito",
      }}
      {...props}
    />
  );
}
