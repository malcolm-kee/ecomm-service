import { faker } from '@faker-js/faker';
import _ from 'lodash';
import images from './images.json';
import {
  ItemAvailabilityEnum,
  ItemConditionEnum,
  MarketingplaceListing,
} from './type';

function createFakeListing(index: number): MarketingplaceListing {
  const availability = _.sample(ItemAvailabilityEnum);

  const image = images[index % images.length];

  return Object.assign(
    {},
    {
      title: faker.commerce.product(),
      description: image.description || faker.commerce.productDescription(),
      price: Number(faker.commerce.price()),
      condition: _.sample(ItemConditionEnum),
      imageUrl: image.url,
      availability,
    },
    availability === 'in-stock'
      ? {
          numOfStock: _.sample([1, 2, 3, 5, 8, 13, 21]),
        }
      : {}
  );
}

export function createMarketplaceListingDb(listingCount: number) {
  return Array.from({ length: listingCount }).map((_, index) =>
    createFakeListing(index)
  );
}
