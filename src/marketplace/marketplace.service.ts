import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  MARKETPLACE_CART_SCHEMA,
  MARKETPLACE_LISTING_SCHEMA,
  MarketplaceCartDocument,
  MarketplaceListing,
  MarketplaceListingDocument,
} from './marketplace.type';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectModel(MARKETPLACE_LISTING_SCHEMA)
    private listingModel: Model<MarketplaceListingDocument>,
    @InjectModel(MARKETPLACE_CART_SCHEMA)
    private cartModel: Model<MarketplaceCartDocument>
  ) {}

  create(listing: MarketplaceListing) {
    return this.listingModel.create(listing);
  }

  getOne(id: string) {
    return this.listingModel.findById(id).exec();
  }

  getMany({
    before,
    page = 1,
    limit = 10,
  }: {
    before?: string;
    page?: number;
    limit?: number | string;
  } = {}) {
    const limitValue = Number(limit);

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
          skip: limitValue * Math.max(page - 1, 0),
          limit: limitValue,
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
    return this.listingModel.findByIdAndDelete(id).exec();
  }

  async getCartItems(userId: string) {
    const cart = await this.cartModel
      .findOne({
        ownerUserId: userId,
      })
      .populate({
        path: 'items.listing',
      });

    if (!cart) {
      return [];
    }

    return cart.items;
  }

  async addCartItem(
    data: {
      listingId: string;
      quantity: number;
    },
    userId: string
  ) {
    const currentCart = await this.cartModel
      .findOne({
        ownerUserId: userId,
      })
      .exec();

    if (!currentCart) {
      return this.cartModel.create({
        ownerUserId: userId,
        items: [
          {
            listing: data.listingId,
            quantity: data.quantity,
          },
        ],
      });
    }

    const existingItem = currentCart.items.find(
      (item) => String(item.listing) === data.listingId
    );

    if (existingItem) {
      existingItem.quantity += data.quantity;
      return currentCart.save();
    } else {
      currentCart.items.push({
        listing: data.listingId,
        quantity: data.quantity,
      });
      return currentCart.save();
    }
  }

  async removeCartItem(listingId: string, userId: string) {
    const currentCart = await this.cartModel
      .findOne({
        ownerUserId: userId,
      })
      .exec();

    if (!currentCart) {
      throw new NotFoundException();
    }

    const existingItem = currentCart.items.find(
      (item) => String(item.listing) === listingId
    );

    if (!existingItem) {
      throw new NotFoundException();
    }

    currentCart.items.pull(existingItem._id);

    return currentCart.save();
  }
}
