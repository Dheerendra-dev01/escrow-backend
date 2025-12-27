import mongoose, { HydratedDocument, Model } from 'mongoose';

export type DisputeRaisedBy = 'client' | 'freelancer';
export type DisputeStatus = 'open' | 'resolved';

export interface IDispute {
  jobId: mongoose.Types.ObjectId;
  raisedBy: DisputeRaisedBy;
  reason: string;
  status: DisputeStatus;
  resolution?: string;
}

const disputeSchema = new mongoose.Schema<IDispute>(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    raisedBy: { type: String, required: true, enum: ['client', 'freelancer'] },
    reason: { type: String, required: true, trim: true },
    status: { type: String, required: true, enum: ['open', 'resolved'], default: 'open', index: true },
    resolution: { type: String, trim: true },
  },
  { timestamps: true },
);

export type DisputeDocument = HydratedDocument<IDispute>;

export const Dispute: Model<IDispute> =
  mongoose.models.Dispute ?? mongoose.model<IDispute>('Dispute', disputeSchema);
