import mongoose, { HydratedDocument, Model } from 'mongoose';

export type TransactionType = 'deposit' | 'release';
export type Chain = 'polygon' | 'ethereum';
export type Currency = 'ETH' | 'MATIC';

export interface ITransaction {
  jobId: mongoose.Types.ObjectId;
  escrowContractId?: mongoose.Types.ObjectId;
  txHash: string;
  fromAddress?: string;
  toAddress?: string;
  amount: number;
  type: TransactionType;
  chain?: Chain;
  currency?: Currency;
}

const transactionSchema = new mongoose.Schema<ITransaction>(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    escrowContractId: { type: mongoose.Schema.Types.ObjectId, ref: 'EscrowContract', index: true },
    txHash: { type: String, required: true, trim: true, index: true },
    fromAddress: { type: String, trim: true },
    toAddress: { type: String, trim: true },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, required: true, enum: ['deposit', 'release'], index: true },
    chain: { type: String, enum: ['polygon', 'ethereum'] },
    currency: { type: String, enum: ['ETH', 'MATIC'] },
  },
  { timestamps: true },
);

export type TransactionDocument = HydratedDocument<ITransaction>;

export const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ?? mongoose.model<ITransaction>('Transaction', transactionSchema);
