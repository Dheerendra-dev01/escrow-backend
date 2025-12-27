import mongoose, { HydratedDocument, Model } from 'mongoose';

export type Chain = 'polygon' | 'ethereum';
export type Currency = 'ETH' | 'MATIC';
export type EscrowStatus = 'CREATED' | 'FUNDED' | 'RELEASED' | 'CANCELLED';

export interface IEscrowContract {
  jobId: mongoose.Types.ObjectId;
  contractAddress: string;
  chain: Chain;
  amount: number;
  currency: Currency;
  status: EscrowStatus;
}

const escrowContractSchema = new mongoose.Schema<IEscrowContract>(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      unique: true,
      index: true,
    },
    contractAddress: { type: String, required: true, trim: true, index: true },
    chain: { type: String, required: true, enum: ['polygon', 'ethereum'] },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, enum: ['ETH', 'MATIC'] },
    status: {
      type: String,
      required: true,
      enum: ['CREATED', 'FUNDED', 'RELEASED', 'CANCELLED'],
      default: 'CREATED',
      index: true,
    },
  },
  { timestamps: true },
);

export type EscrowContractDocument = HydratedDocument<IEscrowContract>;

export const EscrowContract: Model<IEscrowContract> =
  mongoose.models.EscrowContract ??
  mongoose.model<IEscrowContract>('EscrowContract', escrowContractSchema);
