export type ActionDataInterface =
  | {
      status: "success" | "error";
      message: string;
      errors?: { field: string; message: string }[];
    }
  | undefined;
