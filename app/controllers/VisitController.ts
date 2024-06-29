import { redirect } from "@remix-run/node";
import type { VisitInterface } from "../utils/types";
import { commitFlashSession, getFlashSession } from "~/flash-session";
import Visit from "~/models/Visit";
import Vital from "~/models/Vitals";
import Consultation from "~/models/Consultation";
import ReferralFeedback from "~/models/ReferralFeedback";
import LabRequest from "~/models/LabRequest";
import sendEmail from "~/utils/sendEmail";
import {
  generateLabRequestNotification,
  generateLabResultsNotification,
} from "~/data/email-templates";
import UserController from "./UserController";
import User from "~/models/User";
import MedicalRequest from "~/models/MedicalRequest";

export default class VisitController {
  private request: Request;

  constructor(request: Request) {
    this.request = request;
  }

  /**
   * Retrieve all Visit
   * @param param0 pag
   * @returns {visits: VisitInterface, page: number}
   */
  // public async getVisits({
  //   page,
  //   search_term,
  //   limit = 10,
  // }: {
  //   page: number;
  //   search_term?: string;
  //   limit?: number;
  // }): Promise<{ visits: VisitInterface[]; totalPages: number }> {
  //   const skipCount = (page - 1) * limit; // Calculate the number of documents to skip

  //   const searchFilter = search_term
  //     ? {
  //         $or: [
  //           {
  //             name: {
  //               $regex: new RegExp(
  //                 search_term
  //                   .split(" ")
  //                   .map((term) => `(?=.*${term})`)
  //                   .join(""),
  //                 "i"
  //               ),
  //             },
  //           },
  //           {
  //             description: {
  //               $regex: new RegExp(
  //                 search_term
  //                   .split(" ")
  //                   .map((term) => `(?=.*${term})`)
  //                   .join(""),
  //                 "i"
  //               ),
  //             },
  //           },
  //         ],
  //       }
  //     : {};

  //   try {
  //     const visits = await Visit.find(searchFilter)
  //       .skip(skipCount)
  //       .limit(limit)
  //       .populate("church")
  //       .populate("denomination")
  //       .populate("appointingOfficer")
  //       .sort({ name: "asc" })
  //       .exec();

  //     const totalVisitsCount = await Visit.countDocuments(searchFilter).exec();
  //     const totalPages = Math.ceil(totalVisitsCount / limit);

  //     return { visits, totalPages };
  //   } catch (error) {
  //     console.log(error);

  //     throw new Error("Error retrieving visits");
  //   }
  // }

  /**
   * Get a single visit by its ID and populate the staff and medicalRequest fields.
   * @param {string} id - The ID of the Visit document to fetch.
   * @returns {Promise<VisitInterface | null>} - The populated Visit document.
   */
  public getVisitById = async (id: string): Promise<VisitInterface | any> => {
    try {
      const visit = await Visit.findById(id)
        .populate("staff")
        .populate({
          path: "visitRecords.medicalRequest",
          model: "medical_requests",
        })
        .populate({
          path: "visitRecords.vitals",
          model: "vitals",
        })
        .exec();

      return visit;
    } catch (error) {
      console.error("Error fetching visit:", error);

      return {
        status: "error",

        code: 400,
        message: "Error retrieving visits",
      };
    }
  };

  // Function to get vital details from the visitRecords

  public getVitalDetails = async ({
    visitId,
    visitRecordId,
  }: {
    visitId: string;
    visitRecordId: string;
  }): Promise<any> => {
    try {
      // Find the visit by its ID and populate the specific visitRecord's vitals
      const visit = await Visit.findOne({
        _id: visitId,
        "visitRecords._id": visitRecordId,
      })
        .populate({
          path: "visitRecords.vitals",
          // match: { _id: visitRecordId },
        })
        .exec();

      if (!visit) {
        throw new Error("Visit not found");
      }

      // Find the specific visitRecord by its ID
      const visitRecord = visit.visitRecords.find((record: any) =>
        record._id.equals(visitRecordId)
      );

      if (!visitRecord) {
        throw new Error("Visit record not found");
      }

      return visitRecord.vitals;
    } catch (error) {
      console.error("Error getting vital details:", error);
      // throw new Error("Error getting vital details");
    }
  };

  public getConsultsationDetails = async ({
    visitId,
    visitRecordId,
  }: {
    visitId: string;
    visitRecordId: string;
  }): Promise<any> => {
    try {
      // Find the visit by its ID and populate the specific visitRecord's consultation
      const visit = await Visit.findOne({
        _id: visitId,
        "visitRecords._id": visitRecordId,
      })
        .populate({
          path: "visitRecords.consultation",
          // match: { _id: visitRecordId },
        })
        .exec();

      if (!visit) {
        throw new Error("Visit not found");
      }

      // Find the specific visitRecord by its ID
      const visitRecord = visit.visitRecords.find((record: any) =>
        record._id.equals(visitRecordId)
      );

      if (!visitRecord) {
        throw new Error("Visit record not found");
      }

      return visitRecord.consultation;
    } catch (error) {
      console.error("Error getting vital details:", error);
      // throw new Error("Error getting vital details");
    }
  };

  public getLabDetails = async ({
    visitId,
    visitRecordId,
  }: {
    visitId: string;
    visitRecordId: string;
  }): Promise<any> => {
    try {
      // Find the visit by its ID and populate the specific visitRecord's labs
      const visit = await Visit.findOne({
        _id: visitId,
        "visitRecords._id": visitRecordId,
      })
        .populate({
          path: "visitRecords.labs",
          model: "lab_requests",
          // match: { _id: visitRecordId },
        })
        .populate("staff")
        .exec();

      if (!visit) {
        throw new Error("Visit not found");
      }

      // Find the specific visitRecord by its ID
      const visitRecord = visit.visitRecords.find((record: any) =>
        record._id.equals(visitRecordId)
      );

      if (!visitRecord) {
        throw new Error("Visit record not found");
      }

      return visitRecord.labs;
    } catch (error) {
      console.error("Error getting vital details:", error);
      // throw new Error("Error getting vital details");
    }
  };

  public getAllLabRequests = async (): Promise<any> => {
    try {
      const labRequests = await LabRequest.find({})
        .populate({
          path: "visit",
          populate: {
            path: "staff",
            model: "users",
          },
        })
        .sort({ createdAt: "desc" })
        .exec();
      return labRequests;
    } catch (error) {
      console.error("Error getting lab requests:", error);
      return {
        status: "error",
        code: 400,
        message: "Error retrieving lab requests",
      };
    }
  };

  public getLabRequestById = async (id: string): Promise<any> => {
    try {
      const labRequest = await LabRequest.findById(id)
        .populate({
          path: "visit",
          populate: {
            path: "staff",
            model: "users",
          },
        })
        .exec();
      return labRequest;
    } catch (error) {
      console.error("Error getting lab request:", error);
      return {
        status: "error",
        code: 400,
        message: "Error retrieving lab request",
      };
    }
  };

  public getAllLabRequestsByStatus = async (status: string): Promise<any> => {
    try {
      const labRequests = await LabRequest.find({ status })
        .populate({
          path: "visit",
          populate: {
            path: "staff",
            model: "users",
          },
        })
        .sort({ createdAt: "desc" })
        .exec();
      return labRequests;
    } catch (error) {
      console.error("Error getting lab requests:", error);
      return {
        status: "error",
        code: 400,
        message: "Error retrieving lab requests",
      };
    }
  };

  /**
   * Update the vitals ID for a specific visit in the visits array.
   * @param {string} visitId - The ID of the main visit document.
   * @param {string} visitSubId - The ID of the subdocument within the visits array.
   * @param {Types.ObjectId} vitalsId - The new vitals ID to set.
   * @returns {Promise<VisitInterface | null>} - The updated Visit document.
   */
  public addVisitVitals = async ({
    visitId,
    visitSubId,
    temperature,
    pulse,
    respiration,
    sp02,
    weight,
    height,
    bmi,
    bp,
  }: {
    visitId: string;
    visitSubId: string;
    temperature: string;
    pulse: string;
    respiration: string;
    sp02: string;
    weight: string;
    height: string;
    bmi: string;
    bp: string;
  }): Promise<VisitInterface | any> => {
    try {
      // Find the visit and check if the visit record has an existing vitals record
      const visit = await Visit.findOne({
        _id: visitId,
        "visitRecords._id": visitSubId,
      }).exec();
      if (!visit) {
        throw new Error("Visit or visit record not found");
      }

      const visitRecord = visit.visitRecords.id(visitSubId);
      if (!visitRecord) {
        throw new Error("Visit record not found");
      }

      let vital;
      if (visitRecord.vitals) {
        // Update existing vitals record
        vital = await Vital.findByIdAndUpdate(
          visitRecord.vitals,
          { temperature, pulse, respiration, sp02, weight, height, bmi, bp },
          { new: true }
        ).exec();
      } else {
        // Create new vitals record
        vital = await Vital.create({
          visit: visitId,
          temperature,
          pulse,
          respiration,
          sp02,
          weight,
          height,
          bmi,
          bp,
        });

        // Update the visit record with the new vitals ID
        visitRecord.vitals = vital._id;
        await visit.save();
      }

      return {
        status: "success",
        code: 200,
        message: "Vitals added successfully",
        data: visit,
      };
    } catch (error) {
      console.error("Error updating visit vitals:", error);
      throw new Error("Error updating visit vitals");
    }
  };

  /**
   * Update the vitals ID for a specific visit in the visits array.
   * @param {string} visitId - The ID of the main visit document.
   * @param {string} visitSubId - The ID of the subdocument within the visits array.
   * @param {Types.ObjectId} vitalsId - The new vitals ID to set.
   * @returns {Promise<VisitInterface | null>} - The updated Visit document.
   */
  public addVisitConsultation = async ({
    visitId,
    visitSubId,
    consultation,
    complaints,
    investigation,
    disposition,
    treatment,
    diagnosis,
    work_status,
    excuseDutyDuration,
    reviewDate,
    referredTo,
    detained,
    notes,
  }: {
    visitId: string;
    visitSubId: string;
    consultation: string;
    complaints: string;
    investigation: string;
    disposition: string;
    treatment: string;
    diagnosis: string;
    work_status: string;
    excuseDutyDuration: string;
    reviewDate: string;
    referredTo: string;
    detained: boolean;
    notes: string;
  }): Promise<VisitInterface | any> => {
    try {
      // Find the visit and check if the visit record has an existing vitals record
      const visit = await Visit.findOne({
        _id: visitId,
        "visitRecords._id": visitSubId,
      }).exec();
      if (!visit) {
        throw new Error("Visit or visit record not found");
      }

      const visitRecord = visit.visitRecords.id(visitSubId);
      if (!visitRecord) {
        throw new Error("Visit record not found");
      }

      let myConsultaion;
      if (visitRecord.consultation) {
        // Update existing vitals record
        myConsultaion = await Consultation.findByIdAndUpdate(
          visitRecord.consultation,
          {
            consultation,
            complaints,
            investigation,
            disposition,
            treatment,
            diagnosis: JSON.parse(diagnosis),
            workStatus: work_status,
            excuseDutyDuration,
            reviewDate: reviewDate || null,
            referredTo,
            detained,
            notes,
          },
          { new: true }
        ).exec();
      } else {
        myConsultaion = await Consultation.create({
          visit: visitId,
          consultation,
          complaints,
          investigation,
          disposition,
          treatment,
          diagnosis: JSON.parse(diagnosis),
          workStatus: work_status,
          excuseDutyDuration,
          reviewDate: reviewDate || null,
          referredTo,
          detained,
          notes,
        });
        // // Update the visit record with the new vitals ID
        visitRecord.consultation = myConsultaion._id;
        await visit.save();
      }

      const updatedVisit = await Visit.findOneAndUpdate(
        { _id: visitId, "visitRecords._id": visitSubId },
        {
          $set: {
            // "visitRecords.$.consultation": visitRecord.consultation,
            nextAppointment: reviewDate || null,
          },
          status: reviewDate ? "pending" : "completed",
        },
        { new: true }
      ).exec();

      return {
        status: "success",
        code: 200,
        message: "Vitals added successfully",
        data: visit,
      };
    } catch (error) {
      console.error("Error updating visit vitals:", error);
      throw new Error("Error updating visit vitals");
    }
  };

  public addVisitReferralFeedback = async ({
    visitId,
    visitSubId,
    diagnosis,
    treatment,
    followUpPlan,
  }: {
    visitId: string;
    g;
    diagnosis: string;
    treatment: string;
    visitSubId: strin;
    followUpPlan: string;
  }): Promise<VisitInterface | null> => {
    try {
      const vital = await ReferralFeedback.create({
        visit: visitId,
        diagnosis,
        treatment,
        followUpPlan,
      });

      const updatedVisit = await Visit.findOneAndUpdate(
        { _id: visitId, "visitRecords._id": visitSubId },
        { $set: { "visitRecords.$.referralFeedback": vital?._id } },
        { new: true }
      ).exec();

      return updatedVisit;
    } catch (error) {
      console.error("Error updating visit vitals:", error);
      throw new Error("Error updating visit vitals");
    }
  };

  public addVisitLab = async ({
    visitId,
    visitSubId,
    labTests,
  }: {
    visitId: string;
    visitSubId: string;
    labTests: { test: string; result: string }[];
  }): Promise<VisitInterface | any> => {
    try {
      const userController = new UserController(this.request);
      const user = await userController.getUser();

      // Find the visit and check if the visit record has an existing vitals record
      const visit = await Visit.findOne({
        _id: visitId,
        "visitRecords._id": visitSubId,
      }).exec();
      if (!visit) {
        throw new Error("Visit or visit record not found");
      }

      const visitRecord = visit.visitRecords.id(visitSubId);
      if (!visitRecord) {
        throw new Error("Visit record not found");
      }

      let myLabs;
      if (visitRecord.labs) {
        // Update existing vitals record
        myLabs = await LabRequest.findByIdAndUpdate(
          visitRecord.labs,
          {
            labTests,
          },
          { new: true }
        ).exec();
      } else {
        myLabs = await LabRequest.create({
          visit: visitId,
          labTests,
          staff: visit.staff,
          requestedBy: user?._id,
        });
        // // Update the visit record with the new vitals ID
        visitRecord.labs = myLabs._id;
        await visit.save();
      }

      const labTehnicians = await User.find({ role: "lab-technician" }).exec();
      const staff = await User.findById(visit.staff).exec();
      const medicalRequest = await MedicalRequest.findById(
        visitRecord?.medicalRequest
      )
        .populate("approvedBy")
        .exec();

      labTehnicians.forEach(async (labTech) => {
        await sendEmail({
          to: labTech.email as string,
          subject: "New Lab Request",
          html: generateLabRequestNotification({
            staffName: staff.firstName as string,
            approvalDate: new Date(
              myLabs?.createdAt
            ).toDateString() as "string;",
            approvedBy: medicalRequest?.approvedBy?.firstName as string,
            labsRequested: labTests.map((lab) => `<li> ${lab.test} </li>`),
            requestingMedicalOfficer: user?.firstName as string,
          }),
        }).then((response) => {
          console.log(response);
        });
      });

      return {
        status: "success",
        code: 200,
        message: "Labs added successfully",
        data: visit,
      };
    } catch (error) {
      console.error("Error updating visit vitals:", error);
      return {
        status: "error",
        code: 200,
        message: "Labs added successfully",
        errors: [{ error: JSON.stringify(error) }],
      };
    }
  };

  public saveLabResult = async ({
    labId,
    labTests,
  }: {
    labId: string;
    labTests: { test: string; result: string }[];
  }): Promise<any> => {
    try {
      const labRequest = await LabRequest.findByIdAndUpdate(
        labId,
        { labTests, status: "completed" },
        { new: true }
      )
        .populate("requestedBy")
        .populate("staff")
        .exec();

      if (labRequest?.requestedBy?.email) {
        await sendEmail({
          to: labRequest?.requestedBy?.email as string,
          subject: "Medical Request Delicned",
          html: generateLabResultsNotification({
            staffName: labRequest.staff.firstName,
            labRequestDate: labRequest?.createdAt.toDateString() as string,
            resultsDate: new Date().toDateString() as string,
            requestingMedicalOfficer: labRequest?.requestedBy
              ?.firstName as string,
            labsRequested: labRequest.labTests.map(
              (lab) => `<li> ${lab.test} </li>`
            ),
          }),
        }).then((response) => {
          console.log(response);
        });
      }

      return {
        status: "success",
        code: 200,
        message: "Lab result saved successfully",
        data: labRequest,
      };
    } catch (error) {
      console.error("Error saving lab result:", error);
      return {
        status: "error",
        code: 400,
        message: "Error saving lab result",
      };
    }
  };
}
