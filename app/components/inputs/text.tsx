import { Input, InputProps } from "@nextui-org/react";

export default function TextInput(props: InputProps) {
  return (
    <Input
      color="primary"
      labelPlacement="outside"
      placeholder=" "
      variant="bordered"
      classNames={{
        label: "font-sen font-semibold text-slate-700 dark:text-white",
        base: "shadow-none font-nunito",
      }}
      {...props}
    />
  );
}
