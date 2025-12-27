import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Submission } from "../models/submissions";
import { Job } from "../models/job";

class SubmissionController {

  // ---------------- CREATE SUBMISSION ----------------
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { jobId, freelancerId, submissionUrl, message } = req.body;

      if (!jobId || !freelancerId || !submissionUrl) {
        res.status(400).json({
          message: "jobId, freelancerId and submissionUrl are required",
        });
        return;
      }

      if (
        !mongoose.Types.ObjectId.isValid(jobId) ||
        !mongoose.Types.ObjectId.isValid(freelancerId)
      ) {
        res.status(400).json({ message: "Invalid jobId or freelancerId" });
        return;
      }

      // Ensure job exists
      const job = await Job.findById(jobId);
      if (!job) {
        res.status(404).json({ message: "Job not found" });
        return;
      }

      // Ensure correct freelancer
      if (job.freelancerId?.toString() !== freelancerId) {
        res.status(403).json({ message: "You are not assigned to this job" });
        return;
      }

      // Prevent duplicate submission
      const existing = await Submission.findOne({ jobId, freelancerId });
      if (existing) {
        res.status(409).json({ message: "Submission already exists for this job" });
        return;
      }

      const created = await Submission.create({
        jobId,
        freelancerId,
        submissionUrl,
        message,
      });

      // Update job status → SUBMITTED
      await Job.findByIdAndUpdate(jobId, { status: "SUBMITTED" });

      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }

  // ---------------- LIST SUBMISSIONS ----------------
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items = await Submission.find(req.query || {})
        .populate("jobId", "title status")
        .populate("freelancerId", "walletAddress name")
        .lean()
        .exec();

      res.json(items);
    } catch (err) {
      next(err);
    }
  }

  // ---------------- GET SUBMISSION BY ID ----------------
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
      res.status(400).json({ message: "id is required" });
     return;
   }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid submission id" });
        return;
      }

      const item = await Submission.findById(id)
        .populate("jobId", "title status")
        .populate("freelancerId", "walletAddress name")
        .lean()
        .exec();

      if (!item) {
        res.status(404).json({ message: "Submission not found" });
        return;
      }

      res.json(item);
    } catch (err) {
      next(err);
    }
  }

  // ---------------- DELETE SUBMISSION ----------------
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
        if (!id) {
      res.status(400).json({ message: "id is required" });
     return;
   }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid submission id" });
        return;
      }

      const deleted = await Submission.findByIdAndDelete(id).lean().exec();

      if (!deleted) {
        res.status(404).json({ message: "Submission not found" });
        return;
      }

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
}

export default SubmissionController;
