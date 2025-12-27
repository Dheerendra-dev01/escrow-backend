import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { EscrowContract } from "../models/escrowContracts";
import { Job } from "../models/job";

class EscrowContractController {

  // ---------------- CREATE ESCROW ----------------
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { jobId, contractAddress, chain, amount, currency } = req.body;

      if (!jobId || !contractAddress || !chain || !amount || !currency) {
        res.status(400).json({
          message: "jobId, contractAddress, chain, amount and currency are required",
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

      // Prevent duplicate escrow for job
      const existing = await EscrowContract.findOne({ jobId });
      if (existing) {
        res.status(409).json({ message: "Escrow already exists for this job" });
        return;
      }

      const created = await EscrowContract.create({
        jobId,
        contractAddress,
        chain,
        amount,
        currency,
        status: "CREATED",
      });

      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }

  // ---------------- LIST ESCROWS ----------------
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items = await EscrowContract.find(req.query || {})
        .populate("jobId", "title status budget")
        .lean()
        .exec();

      res.json(items);
    } catch (err) {
      next(err);
    }
  }

  // ---------------- GET ESCROW BY ID ----------------
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

	    if (!id) {
      res.status(400).json({ message: "id is required" });
     return;
   }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid escrow id" });
        return;
      }

      const escrow = await EscrowContract.findById(id)
        .populate("jobId", "title status budget")
        .lean()
        .exec();

      if (!escrow) {
        res.status(404).json({ message: "Escrow not found" });
        return;
      }

      res.json(escrow);
    } catch (err) {
      next(err);
    }
  }

  // ---------------- UPDATE ESCROW STATUS ----------------
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

	    if (!id) {
      res.status(400).json({ message: "id is required" });
     return;
   }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid escrow id" });
        return;
      }

      // Prevent illegal backward transitions
      if (status === "CREATED") {
        res.status(400).json({ message: "Invalid escrow status update" });
        return;
      }

      const updated = await EscrowContract.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      )
        .lean()
        .exec();

      if (!updated) {
        res.status(404).json({ message: "Escrow not found" });
        return;
      }

      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  // ---------------- DELETE ESCROW ----------------
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

	    if (!id) {
      res.status(400).json({ message: "id is required" });
     return;
   }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid escrow id" });
        return;
      }

      const deleted = await EscrowContract.findByIdAndDelete(id).lean().exec();
      if (!deleted) {
        res.status(404).json({ message: "Escrow not found" });
        return;
      }

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
}

export default EscrowContractController;
