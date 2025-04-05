import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DataModel,
  DataModelDocument,
  MARKETING_DATA_MODEL_SCHEMA,
} from './marketing.type';

@Injectable()
export class MarketingService {
  constructor(
    @InjectModel(MARKETING_DATA_MODEL_SCHEMA)
    private readonly dataModelSchema: Model<DataModelDocument>
  ) {}

  createData(data: DataModel) {
    return this.dataModelSchema.create(data);
  }

  getOneData(id: string) {
    return this.dataModelSchema.findById(id).exec();
  }

  getDataByType(type: string) {
    return this.dataModelSchema
      .find({
        type,
      })
      .exec();
  }

  updateData(id: string, changes: Partial<DataModel>) {
    return this.dataModelSchema
      .findByIdAndUpdate(id, changes, { new: true })
      .exec();
  }

  deleteOneData(id: string) {
    return this.dataModelSchema.findByIdAndDelete(id).exec();
  }
}
