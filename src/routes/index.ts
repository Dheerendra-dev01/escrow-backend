import express from "express";

import userRoutes from "./userRoutes";
import jobRoutes from "./jobRoutes";
import submissionRoutes from "./submissionRoutes";
import escrowContractRoutes from "./escrowRoutes";
import transactionRoutes from "./transationsRoutes";
import disputeRoutes from "./disputerRoutes";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/jobs", jobRoutes);
router.use("/submissions", submissionRoutes);
router.use("/escrows", escrowContractRoutes);
router.use("/transactions", transactionRoutes);
router.use("/disputes", disputeRoutes);

export default router;
