import mongoose, { HydratedDocument, Model } from 'mongoose';

export type JobStatus = 'CREATED' | 'FUNDED' | 'SUBMITTED' | 'COMPLETED' | 'DISPUTED';

export interface IJob {
  title: string;
  description?: string;
  budget: number;
  clientId: mongoose.Types.ObjectId;
  freelancerId?: mongoose.Types.ObjectId;
  deadline?: Date;
  status: JobStatus;
}

const jobSchema = new mongoose.Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    budget: { type: Number, required: true, min: 0 },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    deadline: { type: Date },
    status: {
      type: String,
      required: true,
      enum: ['CREATED', 'FUNDED', 'SUBMITTED', 'COMPLETED', 'DISPUTED'],
      default: 'CREATED',
      index: true,
    },
  },
  { timestamps: true },
);

export type JobDocument = HydratedDocument<IJob>;

export const Job: Model<IJob> =
  mongoose.models.Job ?? mongoose.model<IJob>('Job', jobSchema);
