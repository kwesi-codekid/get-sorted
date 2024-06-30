import { redirect } from "@remix-run/node";
// import type { MedicalRequestInterface, VisitInterface } from "../utils/types";
// import { getFlashSession } from "~/flash-session";
import MedicalRequest from "~/models/MedicalRequest";
import UserController from "./UserController";
import User from "~/models/User";
import Visit from "~/models/Visit";
// import sendEmail from "~/utils/sendEmail";
// import {
//   generateApprovalEmail,
//   generateDeclinedRequestNotification,
//   generateMedicalOfficerAprrovedRequestNotification,
//   generateNewTreatmentNotification,
//   generateReviewNotificationEmail,
// } from "~/data/email-templates";
import Email from "~/models/Email";

export default class ComplaintController {
  private request: Request;
  // private path: string;

  constructor(request: Request) {
    this.request = request;
    // const url = new URL(request.url);
    // const path = url.pathname + url.search;
  }

  /**
   * Retrieve all MedicalRequest
   * @param param0 pag
   * @returns {medicalRequests: MedicalRequestInterface, page: number}
   */
  public async getMedicalRequests({
    page,
    search_term,
    limit = 10,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
  }): Promise<{
    medicalRequests: MedicalRequestInterface[];
    totalPages: number;
  }> {
    const skipCount = (page - 1) * limit; // Calculate the number of documents to skip

    const searchFilter = search_term
      ? {
          $or: [
            {
              initialComplaint: {
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
      const medicalRequests = await MedicalRequest.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .populate("requestedFor")
        .populate("requestedBy")
        .populate("approvedBy")
        .sort({
          createdAt: "desc",
        })
        .exec();

      const totalMedicalRequestesCount = await MedicalRequest.countDocuments(
        searchFilter
      ).exec();
      const totalPages = Math.ceil(totalMedicalRequestesCount / limit);

      return { medicalRequests, totalPages };
    } catch (error) {
      console.log(error);

      throw new Error("Error retrieving medicalRequests");
    }
  }

  public async getPersonalMedicalRequests({
    page,
    search_term,
    limit = 10,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
  }): Promise<{
    medicalRequests: MedicalRequestInterface[];
    totalPages: number;
  }> {
    const skipCount = (page - 1) * limit; // Calculate the number of documents to skip
    const userController = new UserController(this.request);
    const userId = await userController.getUserId();

    // Define the search filters
    const filters = search_term
      ? {
          $or: [
            { requestedBy: userId, requestedFor: userId },
            { requestedFor: userId, requestedBy: { $ne: userId } },
          ],
          initialComplaint: {
            $regex: new RegExp(
              search_term
                .split(" ")
                .map((term) => `(?=.*${term})`)
                .join(""),
              "i"
            ),
          },
        }
      : {
          $or: [
            { requestedBy: userId, requestedFor: userId },
            { requestedFor: userId, requestedBy: { $ne: userId } },
          ],
        };

    try {
      // Fetch self medical requests with pagination and population of related fields
      const medicalRequests = await MedicalRequest.find(filters)
        .skip(skipCount)
        .limit(limit)
        .populate("requestedFor")
        .populate("requestedBy")
        .populate("approvedBy")
        .populate("declinedBy")
        .sort({
          createdAt: "desc",
        })
        .exec();

      // Count the total number of self medical requests
      const totalRequestCount = await MedicalRequest.countDocuments(
        filters
      ).exec();
      const totalPages = Math.ceil(totalRequestCount / limit);

      return {
        medicalRequests,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Error retrieving medical requests");
    }
  }

  public async getRequestsMadeByUserForOthers({
    page,
    search_term,
    limit = 10,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
  }): Promise<{
    medicalRequests: MedicalRequestInterface[];
    totalPages: number;
  }> {
    const skipCount = (page - 1) * limit; // Calculate the number of documents to skip
    const userController = new UserController(this.request);
    const userId = await userController.getUserId();

    // Define the search filter
    const delegatedFilter = search_term
      ? {
          requestedBy: userId,
          requestedFor: { $ne: userId },
          initialComplaint: {
            $regex: new RegExp(
              search_term
                .split(" ")
                .map((term) => `(?=.*${term})`)
                .join(""),
              "i"
            ),
          },
        }
      : {
          requestedBy: userId,
          requestedFor: { $ne: userId },
        };

    try {
      // Fetch requests made by the user for others with pagination and population of related fields
      const medicalRequests = await MedicalRequest.find(delegatedFilter)
        .skip(skipCount)
        .limit(limit)
        .populate("requestedFor")
        .populate("requestedBy")
        .populate("approvedBy")
        .populate("declinedBy")
        .sort({
          createdAt: "desc",
        })
        .exec();

      // Count the total number of requests made by the user for others
      const totalDelegatedRequestCount = await MedicalRequest.countDocuments(
        delegatedFilter
      ).exec();
      const totalPages = Math.ceil(totalDelegatedRequestCount / limit);

      return { medicalRequests, totalPages };
    } catch (error) {
      console.error(error);
      throw new Error("Error retrieving delegated medical requests");
    }
  }

  public async getMedicalRequest({ id }: { id: string }) {
    try {
      const medicalRequest = await MedicalRequest.findById(id).populate(
        "images"
      );
      // const reviews = await this.Reviews.find({ medicalRequest: id }).populate("user");

      // medicalRequest.reviews = reviews;
      return medicalRequest;
    } catch (error) {
      console.error("Error retrieving medicalRequest:", error);
    }
  }

  /**
   * Create a new medicalRequest
   * @param path string
   * @param name string
   * @param description string
   * @returns MedicalRequestInterface
   */
  public createMedicalRequest = async ({
    initialComplaint,
    requestedFor,
    shift,
  }: {
    initialComplaint: string;
    requestedFor?: string;
    shift?: string;
  }) => {
    try {
      const userController = new UserController(this.request);
      const user = await userController.getUser();
      const userFor = requestedFor ? await User.findById(requestedFor) : user;

      const existingMedicalRequest = await MedicalRequest.findOne({
        requestedFor: requestedFor ? requestedFor : user?._id,
        status: "pending",
      });

      if (user?.role == "nurse") {
        const medicalRequest = await MedicalRequest.create({
          initialComplaint,
          requestedFor: requestedFor ? requestedFor : user?._id,
          requestedBy: user?._id,
          status: "approved",
          shift,
        });

        if (!medicalRequest) {
          return {
            status: "error",
            code: 400,
            message: "Error Adding Medical Request",
          };
        }

        if (userFor.email) {
          const heads = await User.find({
            role: "manager",
            department: userFor.department,
          });

          if (heads.length > 0) {
            heads.forEach(async (head) => {
              await sendEmail({
                to: `${head.email}`,
                subject: "Medical Request Review",
                html: generateNewTreatmentNotification({
                  staffName: userFor.firstName,
                  managerName: head.firstName as string,
                  requestDate: new Date().toDateString(),
                  initialComplaint,
                }),
              }).then((response) => {
                console.log(response);
              });

              // await Email.create({
              //   subject: "Medical Request Review",
              //   to: `${head.email}`,
              //   html: generateReviewNotificationEmail({
              //     staffName: userFor.firstName,
              //     managerName: head.firstName,
              //     requestDate: new Date().toDateString(),
              //   }),
              // });
            });
          }
        }

        return {
          status: "success",
          code: 200,
          message: "Medical Request Added Successful",
        };
      } else {
        if (existingMedicalRequest) {
          return {
            status: "error",
            code: 400,
            message: "You have an unapproved request",
          };
        }

        const medicalRequest = await MedicalRequest.create({
          initialComplaint,
          requestedFor: requestedFor ? requestedFor : user?._id,
          requestedBy: user?._id,
          shift,
        });

        if (!medicalRequest) {
          return {
            status: "error",
            code: 400,
            message: "Error Adding Medical Request",
          };
        }

        if (userFor.email) {
          const heads = await User.find({
            role: "manager",
            department: userFor.department,
          });

          if (heads.length > 0) {
            heads.forEach(async (head) => {
              await sendEmail({
                to: `${head.email}`,
                subject: "Medical Request Review",
                html: generateReviewNotificationEmail({
                  staffName: userFor.firstName,
                  managerName: head.firstName,
                  requestDate: new Date().toDateString(),
                }),
              }).then((response) => {
                console.log(response);
              });

              // await Email.create({
              //   subject: "Medical Request Review",
              //   to: `${head.email}`,
              //   html: generateReviewNotificationEmail({
              //     staffName: userFor.firstName,
              //     managerName: head.firstName,
              //     requestDate: new Date().toDateString(),
              //   }),
              // });
            });
          }
        }

        return {
          status: "success",
          code: 200,
          message: "Medical Request Added Successful",
        };
      }
    } catch (error) {
      console.log(error);

      return {
        status: "error",
        code: 400,
        message: "Error Adding Medical Request",
      };
    }
  };

  /**
   * Update medicalRequest
   * @param param0 _id, name, price, description, category, quantity, costPrice
   * @returns null
   */
  public updateMedicalRequest = async ({
    _id,
    initialComplaint,
    requestedFor,
  }: {
    _id: string;
    initialComplaint: string;
    requestedFor: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await MedicalRequest.findByIdAndUpdate(_id, {
        initialComplaint,
        requestedFor,
      });

      return {
        status: "success",
        code: 200,
        message: "Medical Request Updated Successful",
      };
    } catch (error) {
      console.log(error);

      return {
        status: "error",
        code: 400,
        message: "Error Updating Medical Request",
      };
    }
  };

  /**
   *
   * @param param0 _id
   * @returns
   */
  public deleteMedicalRequest = async (_id: string) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await MedicalRequest.findByIdAndDelete(_id);

      return {
        status: "success",
        code: 200,
        message: "Medical Request Deleted Successfully",
      };
    } catch (error) {
      console.log(error);

      return {
        status: "error",
        code: 400,
        message: "Error Deleting Medical Request",
      };
    }
  };

  public approveMedicalRequest = async ({ _id }: { _id: string }) => {
    try {
      const userController = new UserController(this.request);
      const userId = await userController.getUserId();
      const user = await userController.getUser();

      const updatedRequest = await MedicalRequest.findByIdAndUpdate(
        _id,
        {
          status: "approved",
          approvedBy: userId,
          approvedAt: new Date(),
        },
        {
          new: true,
        }
      )
        .populate("requestedFor")
        .exec();

      const visitExist = await Visit.findOne({
        status: "pending",
        staff: updatedRequest?.requestedFor,
      });

      if (visitExist) {
        await Visit.findByIdAndUpdate(
          visitExist?._id,
          {
            $push: {
              visitRecords: {
                medicalRequest: updatedRequest?._id,
                visitType: "review",
              },
            },
          },
          { new: true }
        ).exec();
      } else {
        const thisVisit = await Visit.create({
          requestType: "request",
          status: "pending",
          staff: updatedRequest?.requestedFor,
        });

        await Visit.findByIdAndUpdate(
          thisVisit?._id,
          {
            $push: {
              visitRecords: {
                medicalRequest: updatedRequest?._id,
                visitType: "initial-visit",
              },
            },
          },
          { new: true }
        ).exec();
      }

      if (updatedRequest?.requestedFor?.email) {
        console.log(updatedRequest?.requestedFor?.email);

        const doctor = await User.findOne({
          role: "doctor",
        });

        await sendEmail({
          to: updatedRequest?.requestedFor?.email as string,
          subject: "Medical Request Approved",
          html: generateApprovalEmail({
            staffName: updatedRequest?.requestedFor?.firstName as string,
            approvalDate: new Date().toDateString(),
            approvedBy: user.firstName,
          }),
        }).then((response) => {
          console.log(response);
        });

        await sendEmail({
          to: doctor?.email as string,
          subject: "Medical Request Approved",
          html: generateMedicalOfficerAprrovedRequestNotification({
            staffName: updatedRequest?.requestedFor?.firstName as string,
            approvalDate: new Date().toDateString(),
            approvedBy: user.firstName as string,
          }),
        }).then((response) => {
          console.log(response);
        });
      }

      return {
        status: "success",
        code: 200,
        message: "Medical Request Approved Successful",
      };
    } catch (error) {
      console.log(error);

      return {
        status: "error",
        code: 400,
        message: "Error Approving Medical Request",
      };
    }
  };

  public declineMedicalRequest = async ({ _id }: { _id: string }) => {
    try {
      const userController = new UserController(this.request);
      const user = await userController.getUser();

      const updatedRequest = await MedicalRequest.findByIdAndUpdate(
        _id,
        {
          status: "declined",
          declinedBy: user?._id,
          declinedAt: new Date(),
        },
        {
          new: true,
        }
      )
        .populate("requestedFor")
        .exec();

      if (updatedRequest?.requestedFor?.email) {
        await sendEmail({
          to: updatedRequest?.requestedFor?.email as string,
          subject: "Medical Request Delicned",
          html: generateDeclinedRequestNotification({
            staffName: updatedRequest?.requestedFor?.firstName as string,
            declinedBy: `${user?.firstName} ${user?.lastName}` as string,
            requestDate: updatedRequest?.createdAt.toDateString() as string,
          }),
        }).then((response) => {
          console.log(response);
        });
      }

      return {
        status: "success",
        code: 200,
        message: "Medical Request Declined Successfully",
      };
    } catch (error) {
      console.log(error);

      return {
        status: "error",
        code: 400,
        message: "Error Approving Medical Request",
      };
    }
  };

  public getUnapprovedRequests = async () => {
    const userController = new UserController(this.request);
    const user = await userController.getUser();

    // Define roles hierarchy
    const roleHierarchy = [
      "staff",
      "supervisor",
      "manager",
      "general-manager",
      "admin",
    ];

    // Get roles inferior to the manager
    const managerRoleIndex = roleHierarchy.indexOf(user.role);
    const inferiorRoles = roleHierarchy.slice(0, managerRoleIndex);

    try {
      // Query to find all users in the same department with inferior roles
      const usersInDepartmentWithInferiorRoles = await User.find({
        department: user.department,
        role: { $in: inferiorRoles },
      })
        .select("_id")
        .exec();

      // Extract user IDs
      const userIds = usersInDepartmentWithInferiorRoles.map(
        (user) => user._id
      );

      // Query to find all unapproved medical requests by these users
      const unapprovedRequests = await MedicalRequest.find({
        requestedFor: { $in: userIds },
        status: "pending",
      })
        .populate("requestedBy requestedFor approvedBy")
        .exec();

      return unapprovedRequests;
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        code: 400,
        message: "Error retrieving unapproved Medical Requests",
      };
    }
  };

  public getMedicalRequestsForSuperior = async () => {
    try {
      const userController = new UserController(this.request);
      const userId = await userController.getUserId();
      // Get the manager's details
      const manager = await User.findById(userId).exec();
      if (!manager) {
        throw new Error("Manager not found");
      }

      // Define roles hierarchy
      const roleHierarchy = [
        "staff",
        "supervisor",
        "manager",
        "general-manager",
        "admin",
      ];

      // Get roles inferior to the manager
      const managerRoleIndex = roleHierarchy.indexOf(manager.role);
      const inferiorRoles = roleHierarchy.slice(0, managerRoleIndex);

      // Query to find all medical requests by department and excluding requests by superior roles
      const requests = await MedicalRequest.find({
        requestedBy: {
          $in: await User.find({
            department: manager.department,
            role: { $in: inferiorRoles },
          })
            .select("_id")
            .exec(),
        },
      })
        .populate("requestedBy requestedFor approvedBy")
        .exec();

      return requests;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching medical requests");
    }
  };

  public async getApprovedRequests({
    page,
    search_term,
    limit = 10,
    date,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
    date?: string;
  }): Promise<{
    visits: VisitInterface[];
    totalPages: number;
  }> {
    const skipCount = (page - 1) * limit;

    const searchFilter = search_term
      ? {
          $or: [
            {
              "medicalRequest.requestedFor.staffId": {
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
              "medicalRequest.requestedFor.firstName": {
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
              "medicalRequest.requestedFor.lastName": {
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
              "medicalRequest.requestedFor.email": {
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

    if (date) {
      const dateObj = new Date(date);
      const nextDay = new Date(dateObj);
      nextDay.setDate(dateObj.getDate() + 1);

      searchFilter.createdAt = {
        $gte: dateObj,
        $lt: nextDay,
      };
    }

    try {
      const visits = await Visit.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .populate("staff")
        // .populate({
        //   path: "medicalRequest",
        //   populate: {
        //     path: "requestedFor",
        //     model: "users",
        //   },
        // })
        .sort({
          createdAt: "desc",
        })
        .exec();

      const totalVisitsCount = await Visit.countDocuments(searchFilter).exec();
      const totalPages = Math.ceil(totalVisitsCount / limit);

      return { visits, totalPages };
    } catch (error) {
      console.log(error);

      throw new Error("Error retrieving visits");
    }
  }
}
