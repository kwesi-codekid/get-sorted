export type ActionDataInterface =
  | {
      status: "success" | "error";
      message: string;
      errors?: { field: string; message: string }[];
    }
  | undefined;

export type UserInterface = {
  _id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  phone?: string;
  department?: DepartmentInterface;
  otp?: string;
  staffId?: string;
  role?: string;
  position?: string;
  photo?: string;
  availability?: boolean;
  createdAt?: string;
  deletedAt?: string;
};

export type UserRoleInterface = {
  id?: string;
  value?: string;
  display_name?: string;
};

export type DepartmentInterface = {
  _id?: string;
  name: string;
  description: string;
  phone?: string;
};
