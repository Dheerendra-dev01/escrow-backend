import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Dispute } from "../models/disputes";
import { Job } from "../models/job";

class DisputeController {

  // ---------------- RAISE DISPUTE ----------------
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { jobId, raisedBy, reason } = req.body;

      if (!jobId || !raisedBy || !reason) {
        res.status(400).json({
          message: "jobId, raisedBy and reason are required",
        });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        res.status(400).json({ message: "Invalid jobId" });
        return;
      }

      // Ensure job exists
      const job = await Job.findById(jobId);
      if (!job) {
        res.status(404).json({ message: "Job not found" });
        return;
      }

      // Prevent multiple open disputes for same job
      const existing = await Dispute.findOne({ jobId, status: "open" });
      if (existing) {
        res.status(409).json({ message: "An open dispute already exists for this job" });
        return;
      }

      const created = await Dispute.create({
        jobId,
        raisedBy,
        reason,
        status: "open",
      });

      // Optional: mark job as DISPUTED
      await Job.findByIdAndUpdate(jobId, { status: "DISPUTED" });

      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }

  // ---------------- LIST DISPUTES ----------------
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items = await Dispute.find(req.query || {})
        .populate("jobId", "title status budget")
        .lean()
        .exec();

      res.json(items);
    } catch (err) {
      next(err);
    }
  }

  // ---------------- GET DISPUTE BY ID ----------------
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
        if (!id) {
      res.status(400).json({ message: "id is required" });
     return;
   }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid dispute id" });
        return;
      }

      const item = await Dispute.findById(id)
        .populate("jobId", "title status budget")
        .lean()
        .exec();

      if (!item) {
        res.status(404).json({ message: "Dispute not found" });
        return;
      }

      res.json(item);
    } catch (err) {
      next(err);
    }
  }

  // ---------------- RESOLVE DISPUTE ----------------
  static async resolve(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { resolution } = req.body;

        if (!id) {
      res.status(400).json({ message: "id is required" });
     return;
   }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid dispute id" });
        return;
      }

      if (!resolution) {
        res.status(400).json({ message: "Resolution is required" });
        return;
      }

      const dispute = await Dispute.findById(id);
      if (!dispute) {
        res.status(404).json({ message: "Dispute not found" });
        return;
      }

      if (dispute.status === "resolved") {
        res.status(400).json({ message: "Dispute already resolved" });
        return;
      }

      dispute.status = "resolved";
      dispute.resolution = resolution;
      await dispute.save();

      res.json(dispute);
    } catch (err) {
      next(err);
    }
  }

  // ---------------- DELETE DISPUTE ----------------
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

        if (!id) {
      res.status(400).json({ message: "id is required" });
     return;
   }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid dispute id" });
        return;
      }

      const deleted = await Dispute.findByIdAndDelete(id).lean().exec();
      if (!deleted) {
        res.status(404).json({ message: "Dispute not found" });
        return;
      }

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
}

export default DisputeController;
