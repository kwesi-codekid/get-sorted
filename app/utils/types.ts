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
  staffId?: string;
  role?: "admin" | "support" | "staff";
  position?: string;
  photo?: string;
  availability?: boolean;
  createdAt?: string;
  deletedAt?: string;
};

export type DepartmentInterface = {
  _id?: string;
  name: string;
  description: string;
  phone?: string;
};

export interface TicketInterface {
  id: string; // Unique identifier for the ticket
  title: string; // Brief title of the issue or request
  description: string; // Detailed description of the issue or request
  status: "open" | "in-progress" | "resolved" | "closed"; // Current status of the ticket
  priority: "low" | "medium" | "high" | "urgent"; // Priority level of the ticket
  assignee?: UserInterface; // ID or name of the person assigned to the ticket
  reporter: UserInterface; // ID or name of the person who reported the issue
  createdAt: Date; // Timestamp when the ticket was created
  updatedAt: Date; // Timestamp when the ticket was last updated
  comments?: Comment[]; // Optional array of comments on the ticket
}

export interface CommentInterface {
  id: string; // Unique identifier for the comment
  ticketId: string; // ID of the ticket this comment belongs to
  author: string; // ID or name of the person who wrote the comment
  content: string; // The content of the comment
  createdAt: Date; // Timestamp when the comment was created
}

export interface FAQInterface {
  _id: string; // Unique identifier for the FAQ
  question: string; // The question being asked
  answer: string; // The answer to the question
  category: string; // Category to which the FAQ belongs
  createdAt: Date; // Timestamp when the FAQ was created
  updatedAt: Date; // Timestamp when the FAQ was last updated
}
