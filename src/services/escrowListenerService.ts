import { ethers } from "ethers";
import { EscrowContract } from "../models/escrowContracts";
import { Job } from "../models/job";
import { Transaction } from "../models/transactions";
import { env } from "../config/env";
import EscrowABI from "../abi/Escrow.json";

export const startEscrowListener = async () => {
  const provider = new ethers.JsonRpcProvider(env.RPC_URL);

  const escrows = await EscrowContract.find();

  for (const escrow of escrows) {
    const contract = new ethers.Contract(
      escrow.contractAddress,
      EscrowABI,
      provider
    );

    // 🔹 FUNDED EVENT
    contract.on("Funded", async (from, amount, tx) => {
      await EscrowContract.findByIdAndUpdate(escrow._id, {
        status: "FUNDED",
      });

      await Job.findByIdAndUpdate(escrow.jobId, {
        status: "FUNDED",
      });

      await Transaction.create({
        jobId: escrow.jobId,
        escrowContractId: escrow._id,
        txHash: tx.transactionHash,
        fromAddress: from,
        amount: Number(amount),
        type: "deposit",
        chain: escrow.chain,
        currency: escrow.currency,
      });
    });

    // 🔹 RELEASED EVENT
    contract.on("Released", async (to, amount, tx) => {
      await EscrowContract.findByIdAndUpdate(escrow._id, {
        status: "RELEASED",
      });

      await Job.findByIdAndUpdate(escrow.jobId, {
        status: "COMPLETED",
      });

      await Transaction.create({
        jobId: escrow.jobId,
        escrowContractId: escrow._id,
        txHash: tx.transactionHash,
        toAddress: to,
        amount: Number(amount),
        type: "release",
        chain: escrow.chain,
        currency: escrow.currency,
      });
    });
  }
};
