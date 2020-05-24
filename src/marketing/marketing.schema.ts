import { Schema } from 'mongoose';
import { DataModel } from './marketing.type';

export const MarketingModelSchema = new Schema<DataModel>(
  {
    type: String,
    data: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);
