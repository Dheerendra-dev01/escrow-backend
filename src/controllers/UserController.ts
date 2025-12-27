import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

class UserController {

  // ---------------- REGISTER / SIGN-IN (Web3) ----------------
  static async auth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { walletAddress, name, email } = req.body;

      console.log("code here");

      if (!walletAddress) {
        res.status(400).json({ message: "walletAddress is required" });
        return;
      }

      let user = await User.findOne({ walletAddress });


      console.log("user:", user);

      // Auto-register
      if (!user) {
        user = await User.create({
          walletAddress,
          name,
          email,
          role: "client",
        });
      }

      const token = jwt.sign(
        {
          userId: user._id,
          walletAddress: user.walletAddress,
          role: user.role,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "24h" }
      );

      res.status(200).json({
        message: "Authenticated successfully",
        token,
        user,
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error",err });
      //next(err);
    }
  }

  // ---------------- LIST USERS ----------------
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await User.find(req.query || {}).lean().exec();
      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  // ---------------- GET USER BY ID ----------------
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const user = await User.findById(id).lean().exec();
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  // ---------------- UPDATE USER ----------------
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const updated = await User.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      ).lean().exec();

      if (!updated) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  // ---------------- DELETE USER ----------------
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const deleted = await User.findByIdAndUpdate({
        __id: id
      }, {
        isDeleted: true
      })
      if (!deleted) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
}

export default UserController;
