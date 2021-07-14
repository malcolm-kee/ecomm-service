import faker from 'faker';
import _ from 'lodash';
import {
  ItemAvailabilityEnum,
  ItemConditionEnum,
  MarketingplaceListing,
} from './type';

function createFakeListing(): MarketingplaceListing {
  const availability = _.sample(ItemAvailabilityEnum);

  return Object.assign(
    {},
    {
      title: faker.commerce.product(),
      description: faker.commerce.productDescription(),
      price: Number(faker.commerce.price()),
      condition: _.sample(ItemConditionEnum),
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
  return Array.from({ length: listingCount }).map(() => createFakeListing());
}
