import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Transaction } from "../models/transactions";
import { Job } from "../models/job";
import { EscrowContract } from "../models/escrowContracts";

class TransactionController {

  // ---------------- CREATE TRANSACTION ----------------
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        jobId,
        escrowContractId,
        txHash,
        fromAddress,
        toAddress,
        amount,
        type,
        chain,
        currency,
      } = req.body;

      if (!jobId || !txHash || !amount || !type) {
        res.status(400).json({
          message: "jobId, txHash, amount and type are required",
        });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        res.status(400).json({ message: "Invalid jobId" });
        return;
      }

      if (escrowContractId && !mongoose.Types.ObjectId.isValid(escrowContractId)) {
        res.status(400).json({ message: "Invalid escrowContractId" });
        return;
      }

      // Ensure job exists
      const job = await Job.findById(jobId);
      if (!job) {
        res.status(404).json({ message: "Job not found" });
        return;
      }

      // Optional: ensure escrow exists if provided
      if (escrowContractId) {
        const escrow = await EscrowContract.findById(escrowContractId);
        if (!escrow) {
          res.status(404).json({ message: "Escrow contract not found" });
          return;
        }
      }

      // Prevent duplicate txHash
      const existingTx = await Transaction.findOne({ txHash });
      if (existingTx) {
        res.status(409).json({ message: "Transaction already recorded" });
        return;
      }

      const created = await Transaction.create({
        jobId,
        escrowContractId,
        txHash,
        fromAddress,
        toAddress,
        amount,
        type,
        chain,
        currency,
      });

      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }

  // ---------------- LIST TRANSACTIONS ----------------
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items = await Transaction.find(req.query || {})
        .populate("jobId", "title status budget")
        .populate("escrowContractId", "contractAddress chain status")
        .lean()
        .exec();

      res.json(items);
    } catch (err) {
      next(err);
    }
  }

  // ---------------- GET TRANSACTION BY ID ----------------
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
        if (!id) {
      res.status(400).json({ message: "id is required" });
     return;
   }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid transaction id" });
        return;
      }

      const item = await Transaction.findById(id)
        .populate("jobId", "title status budget")
        .populate("escrowContractId", "contractAddress chain status")
        .lean()
        .exec();

      if (!item) {
        res.status(404).json({ message: "Transaction not found" });
        return;
      }

      res.json(item);
    } catch (err) {
      next(err);
    }
  }

  // ---------------- DELETE TRANSACTION ----------------
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
        if (!id) {
      res.status(400).json({ message: "id is required" });
     return;
   }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid transaction id" });
        return;
      }

      const deleted = await Transaction.findByIdAndDelete(id).lean().exec();
      if (!deleted) {
        res.status(404).json({ message: "Transaction not found" });
        return;
      }

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
}

export default TransactionController;
