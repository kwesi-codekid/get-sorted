export type ActionDataInterface =
  | {
      status: "success" | "error";
      message: string;
      errors?: { field: string; message: string }[];
    }
  | undefined;

export type AdminNavLinkInterface = {
  path: string;
  icon: JSX.Element;
  label: string;
};

export type SelectItemInterface = {
  key: string;
  value: string;
  display_name: string;
};
export type SelectItemsInterface = SelectItemInterface[];

export type UserInterface = {
  _id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  phone?: string;
  dateOfBirth?: string;
  department?: DepartmentInterface;
  otp?: string;
  staffId?: string;
  role?: string;
  position?: string;
  permissions?: string[];
  generalManager?: boolean;
  employeeStatus?: "active" | "inactive";
  contractor?: string;

  createdAt?: string;
};

export type UserRoleInterface = {
  id: string;
  name: string;
  display_name: string;
};

export type DepartmentInterface = {
  _id?: string;
  name: string;
  parent?: string;
  description: string;
  manager?: UserInterface;
  supervisors?: UserInterface[];
  isParent?: boolean;
};

export type ComplaintInterface = {
  _id: string;
  requestedFor: UserInterface;
  requestedBy: UserInterface;
  initialComplaint: string;
  approvedBy: UserInterface;
  approvedAt: Date;
  declinedBy: UserInterface;
  declinedAt: Date;
  status: "pending" | "approved" | "declined";
  shift: "day" | "night";
  createdAt: Date;
  updatedAt: Date;
};

export type EmailInterface = {
  _id: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};
