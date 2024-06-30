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

export type MedicalRequestInterface = {
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

export type VitalInterface = {
  _id?: string;
  visit?: VitalInterface;
  temperature?: string;
  pulse?: string;
  respiration?: string;
  sp02?: string;
  weight?: string;
  height?: string;
  bmi?: string;
  bp?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type VisitInterface = {
  _id: string;
  medicalRequest: MedicalRequestInterface;
  staff: UserInterface;
  requestType: "walk-in" | "request" | "emergency" | "schedule";
  status: "pending" | "completed";
  visitRecords: {
    medicalRequest: MedicalRequestInterface;
    visitType: "initial-visit" | "review";
    visited: Boolean;
    nextAppointment: Date;

    vitals: VitalInterface;
    consultation: VitalInterface;
    labs: VitalInterface;

    createdAt: Date;
    updatedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
};

export type ConsultationInterface = {
  _id: string;
  visit: VisitInterface;
  consultation: string;
  complaints: string;
  investigation: string;
  disposition: string;
  treatment: string;
  diagnosis: string[];
  workStatus: string[];
  excuseDutyDuration: number;
  reviewDate: Date;
  referredTo: string;
  detained: boolean;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ReferralFeedbackInterface = {
  _id: string;
  visit: VisitInterface;
  diagnosis: string;
  treatment: string;
  followUpPlan: string;
};

export type EmailInterface = {
  _id: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};

export type LabRequestInterface = {
  _id: string;
  visit: VisitInterface;
  requestedBy: UserInterface;
  staff: UserInterface;
  labTests: {
    test: string;
    result: string;
  }[];
  status: "pending" | "completed";
  createdAt: Date;
  updatedAt: Date;
};
