import { faker } from '@faker-js/faker';
import { factory, oneOf, primaryKey } from '@mswjs/data';

export const db = factory({
  product: {
    id: primaryKey(faker.number.int),
    name: faker.commerce.productName,
    price: () => faker.number.int({ min: 1, max: 1000 }),
    category: oneOf('category'),
  },
  category: {
    id: primaryKey(faker.number.int),
    name: faker.commerce.department,
  }
})