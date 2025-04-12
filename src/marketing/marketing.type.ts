import { Document } from 'mongoose';

export type DataModel = {
  type: string;
  data: {
    [fieldName: string]: unknown;
  };
};

export type DataModelDocument = DataModel &
  Document<string, unknown, DataModel>;

export const MARKETING_DATA_MODEL_SCHEMA = 'MarketingDataModel';
