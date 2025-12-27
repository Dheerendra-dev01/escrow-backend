import mongoose, { HydratedDocument, Model } from 'mongoose';

export interface ISubmission {
  jobId: mongoose.Types.ObjectId;
  freelancerId: mongoose.Types.ObjectId;
  submissionUrl: string;
  message?: string;
}

const submissionSchema = new mongoose.Schema<ISubmission>(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    submissionUrl: { type: String, required: true, trim: true },
    message: { type: String, trim: true },
  },
  { timestamps: true },
);

export type SubmissionDocument = HydratedDocument<ISubmission>;

export const Submission: Model<ISubmission> =
  mongoose.models.Submission ?? mongoose.model<ISubmission>('Submission', submissionSchema);
