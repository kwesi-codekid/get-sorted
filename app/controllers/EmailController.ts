import { redirect } from "@remix-run/node";
import type { EmailInterface } from "../utils/types";
import { commitFlashSession, getFlashSession } from "~/flash-session";
import Email from "~/models/Email";

export default class EmailController {
  private request: Request;
  private path: string;

  constructor(request: Request) {
    const url = new URL(request.url);
    const path = url.pathname + url.search;

    this.request = request;
    this.path = path;
  }

  /**
   * Retrieve all Email
   * @param param0 page
   * @param param1 search_term
   * @param param2 limit
   * @returns {emails: EmailInterface, totalPages: number}
   */
  public async getEmails({
    page,
    search_term,
    limit = 10,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
  }): Promise<{ emails: EmailInterface[]; totalPages: number } | any> {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const skipCount = (page - 1) * limit;

    const searchFilter = search_term
      ? {
          $or: [
            {
              to: {
                $regex: new RegExp(
                  search_term
                    .split(" ")
                    .map((term) => `(?=.*${term})`)
                    .join(""),
                  "i"
                ),
              },
            },
            {
              subject: {
                $regex: new RegExp(
                  search_term
                    .split(" ")
                    .map((term) => `(?=.*${term})`)
                    .join(""),
                  "i"
                ),
              },
            },
          ],
        }
      : {};

    try {
      const emails = await Email.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .sort({
          createdAt: "desc",
        })
        .exec();

      const totalEmailsCount = await Email.countDocuments(searchFilter).exec();
      const totalPages = Math.ceil(totalEmailsCount / limit);

      return { emails, totalPages };
    } catch (error) {
      console.log(error);
      session.flash("alert", {
        title: "Error!",
        status: "error",
        message: "Error retrieving emails",
      });

      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
      // throw new Error("Error retrieving emails");
    }
  }

  /**
   * Retrieve a single Email
   * @param id string
   * @returns EmailInterface
   */
  public async getEmail({ id }: { id: string }) {
    try {
      const email = await Email.findById(id);
      return email;
    } catch (error) {
      console.error("Error retrieving email:", error);
    }
  }

  /**
   * Create a new email
   * @param path string
   * @param name string
   * @param parent string
   * @param description string
   * @returns EmailInterface
   */
  public createEmail = async ({
    name,
    parent,
    description,
  }: {
    name: string;
    parent: string;
    description: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const email = await Email.create({
        name,
        parent: parent || null,
        description,
        isParent: parent ? false : true,
      });

      if (!email) {
        return {
          status: "error",
          code: 400,
          message: "Error adding email",
          errors: [
            {
              field: "name",
              message: "Error adding email",
            },
          ],
        };
      }

      return {
        status: "success",
        code: 200,
        message: "Email added successfully",
        data: email,
      };
    } catch (error) {
      console.log(error);

      return {
        status: "error",
        code: 400,
        message: "Error adding email",
      };
    }
  };

  /**
   * Update email
   * @param param0 _id
   * @param param1 name
   * @param param2 parent
   * @param param3 description
   * @returns null
   */
  public updateEmail = async ({
    _id,
    name,
    parent,
    description,
    supervisors,
    manager,
  }: {
    _id: string;
    name: string;
    parent: string;
    description: string;
    supervisors: string[];
    manager: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const updated = await Email.findByIdAndUpdate(
        _id,
        {
          name,
          parent,
          description,
          supervisors,
          manager: manager || null,
        },
        { new: true }
      );

      return {
        status: "success",
        code: 200,
        message: "Email updated successfully",
        data: updated,
      };
    } catch (error) {
      return {
        status: "error",
        code: 400,
        message: "Error updating email",
      };
    }
  };

  /**
   * Delete Email
   * @param param0 _id
   * @returns null
   */
  public deleteEmail = async ({ _id }: { _id: string }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await Email.findByIdAndDelete(_id);

      return {
        status: "success",
        code: 200,
        message: "Email deleted successfully",
      };
    } catch (error) {
      console.log(error);

      return {
        status: "error",
        code: 400,
        message: "Error deleting email",
      };
    }
  };
}
