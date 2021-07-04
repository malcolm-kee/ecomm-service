import faker from 'faker';
import _ from 'lodash';
import {
  ItemAvailabilityEnum,
  ItemConditionEnum,
  MarketingplaceListing,
} from './type';

function createFakeListing(): MarketingplaceListing {
  return {
    title: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    price: Number(faker.commerce.price()),
    condition: _.sample(ItemConditionEnum),
    availability: _.sample(ItemAvailabilityEnum),
  };
}

export function createMarketplaceListingDb(listingCount: number) {
  return Array.from({ length: listingCount }).map(() => createFakeListing());
}
