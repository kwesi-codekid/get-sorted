import { redirect } from "@remix-run/node";
import type { BranchInterface } from "../utils/types";
import { commitFlashSession, getFlashSession } from "~/utils/flash-session";
import Branch from "~/models/Branch";

export default class BranchController {
  private request: Request;

  constructor(request: Request) {
    this.request = request;
  }

  /**
   * Retrieve all Branch
   * @param param0 pag
   * @returns {branches: BranchInterface, page: number}
   */
  public async getBranches({
    page,
    search_term,
    limit = 10,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
  }): Promise<{ branches: BranchInterface[]; totalPages: number }> {
    const skipCount = (page - 1) * limit; // Calculate the number of documents to skip

    const searchFilter = search_term
      ? {
          $or: [
            {
              name: {
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
              description: {
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
      const branches = await Branch.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .populate("church")
        .populate("denomination")
        .populate("appointingOfficer")
        .sort({ name: "asc" })
        .exec();

      const totalBranchesCount = await Branch.countDocuments(
        searchFilter
      ).exec();
      const totalPages = Math.ceil(totalBranchesCount / limit);

      return { branches, totalPages };
    } catch (error) {
      console.log(error);

      throw new Error("Error retrieving branches");
    }
  }

  public async getBranch({ id }: { id: string }) {
    try {
      const branch = await Branch.findById(id);
      // const reviews = await this.Reviews.find({ branch: id }).populate("user");

      // branch.reviews = reviews;
      return branch;
    } catch (error) {
      console.error("Error retrieving branch:", error);
    }
  }

  /**
   * Create a new branch
   * @param path string
   * @param name string
   * @param description string
   * @returns BranchInterface
   */
  public createBranch = async ({
    path,
    name,
    church,
    denomination,
    appointingOfficer,
    licenseDate,
    location,
  }: {
    path: string;
    name: string;
    church: string;
    denomination: string;
    appointingOfficer: string;
    licenseDate: string;
    location: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const existingBranch = await Branch.findOne({ name });
    // const settingsController = await new SettingsController(this.request);
    // const generalSettings = await settingsController.getGeneralSettings();

    if (existingBranch) {
      session.flash("message", {
        title: "Branch already exists",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    const branch = await Branch.create({
      name,
      church,
      denomination,
      appointingOfficer,
      licenseDate,
      location,
    });

    if (!branch) {
      session.flash("message", {
        title: "Error Adding Branch",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    session.flash("message", {
      title: "Branch Added Successful",
      status: "success",
    });
    return redirect(path, {
      headers: {
        "Set-Cookie": await commitFlashSession(session),
      },
    });
  };

  /**
   * Import branches from csv
   * @param data Array of branches
   * @returns null
   */
  public importBatch = async (data) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const branches = await Branch.create(data);
    if (!branches) {
      session.flash("message", {
        title: "Error Importing Branches",
        status: "error",
      });
      return redirect(`/admin/branches`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    session.flash("message", {
      title: "Branches Imported Successful",
      status: "success",
    });
    return redirect(`/admin/branches`, {
      headers: {
        "Set-Cookie": await commitFlashSession(session),
      },
    });
  };

  /**
   * Update branch
   * @param param0 _id, name, price, description, category, quantity, costPrice
   * @returns null
   */
  public updateBranch = async ({
    path,
    _id,
    name,
    church,
    denomination,
    appointingOfficer,
    licenseDate,
    location,
  }: {
    path: string;
    _id: string;
    name: string;
    church: string;
    denomination: string;
    appointingOfficer: string;
    licenseDate: string;
    location: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await Branch.findByIdAndUpdate(_id, {
        name,
        church,
        denomination,
        appointingOfficer,
        licenseDate,
        location,
      });

      session.flash("message", {
        title: "Branch Updated Successful",
        status: "success",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      console.log(error);

      session.flash("message", {
        title: "Error Updating Branch",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public deleteBranch = async ({
    _id,
    path,
  }: {
    _id: string;
    path: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await Branch.findByIdAndDelete(_id);

      session.flash("message", {
        title: "Branch Deleted Successful",
        status: "success",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      console.log(error);

      session.flash("message", {
        title: "Error Deleting Branch",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };
}
