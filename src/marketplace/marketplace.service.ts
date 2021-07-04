import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MarketplaceListing,
  MarketplaceListingDocument,
  MARKETPLACE_LISTING_SCHEMA,
} from './marketplace.type';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectModel(MARKETPLACE_LISTING_SCHEMA)
    private listingModel: Model<MarketplaceListingDocument>
  ) {}

  create(listing: MarketplaceListing) {
    return this.listingModel.create(listing);
  }

  getOne(id: string) {
    return this.listingModel.findById(id).exec();
  }

  getMany({
    before,
    limit = 10,
  }: {
    before?: string;
    limit?: number | string;
  } = {}) {
    return this.listingModel
      .find(
        before
          ? {
              createdAt: {
                $lt: before,
              },
            }
          : {},
        {},
        {
          sort: {
            createdAt: -1,
          },
          limit: Number(limit),
        }
      )
      .exec();
  }

  updateOne(id: string, changes: Partial<MarketplaceListing>) {
    return this.listingModel
      .findByIdAndUpdate(id, changes, { new: true })
      .exec();
  }

  deleteOne(id: string) {
    return this.listingModel.findByIdAndRemove(id).exec();
  }
}
