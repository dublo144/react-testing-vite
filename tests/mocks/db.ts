import { faker } from '@faker-js/faker';
import { factory, manyOf, oneOf, primaryKey } from '@mswjs/data';

export const db = factory({
  product: {
    id: primaryKey(faker.number.int),
    name: faker.commerce.productName,
    price: () => faker.number.int({ min: 1, max: 1000 }),
    categoryId: faker.number.int,
    category: oneOf('category'),
  },
  category: {
    id: primaryKey(faker.number.int),
    products: manyOf('product'),
    name: faker.commerce.department,
  }
})

/* --------------------------------- Helpers -------------------------------- */
export const getProductsByCategory = (categoryId: number) => db.product.findMany({
  where: { categoryId: { equals: categoryId } },
});