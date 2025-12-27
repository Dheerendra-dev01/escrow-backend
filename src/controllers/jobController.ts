import { Request, Response, NextFunction } from "express";
import { Job } from "../models/job";
import mongoose from "mongoose";

class JobController {

  // ---------------- CREATE JOB ----------------
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, budget, clientId } = req.body;
      console.log("Creating job with data:", req.body);

      if (!title || !budget || !clientId) {
        res.status(400).json({ message: "title, budget and clientId are required" });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(clientId)) {
        res.status(400).json({ message: "Invalid clientId" });
        return;
      }

      const created = await Job.create(req.body);
      console.log("Created job:", created);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }

  // ---------------- LIST JOBS ----------------
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items = await Job.find(req.query || {})
        .populate("clientId", "walletAddress name")
        .populate("freelancerId", "walletAddress name")
        .lean()
        .exec();

      res.json(items);
    } catch (err) {
      next(err);
    }
  }

  // ---------------- GET JOB BY ID ----------------
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

        if (!id) {
      res.status(400).json({ message: "id is required" });
     return;
   }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid job id" });
        return;
      }

      const item = await Job.findById(id)
        .populate("clientId", "walletAddress name")
        .populate("freelancerId", "walletAddress name")
        .lean()
        .exec();

      if (!item) {
        res.status(404).json({ message: "Job not found" });
        return;
      }

      res.json(item);
    } catch (err) {
      next(err);
    }
  }

  // ---------------- UPDATE JOB ----------------
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

        if (!id) {
      res.status(400).json({ message: "id is required" });
     return;
   }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid job id" });
        return;
      }

      // Prevent illegal status jumps (basic safety)
      if (req.body.status === "CREATED") {
        res.status(400).json({ message: "Invalid status update" });
        return;
      }

      const updated = await Job.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      )
        .lean()
        .exec();

      if (!updated) {
        res.status(404).json({ message: "Job not found" });
        return;
      }

      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  // ---------------- DELETE JOB ----------------
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

        if (!id) {
      res.status(400).json({ message: "id is required" });
     return;
   }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid job id" });
        return;
      }

      const deleted = await Job.findByIdAndDelete(id).lean().exec();

      if (!deleted) {
        res.status(404).json({ message: "Job not found" });
        return;
      }

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
}

export default JobController;
