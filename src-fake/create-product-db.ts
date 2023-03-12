import { faker } from '@faker-js/faker';
import _ from 'lodash';
import path from 'path';
import { imageOutputFolder, imagePublicPath, numOfProducts } from './constants';
import { ImageProcessor } from './image-processor';
import { getId } from './lib/get-id';
import { isUrl } from './lib/is-url';
import { products } from './products';
import { Product, ProductDto, ProductImageInfo } from './type';

function getRandomInteger(max: number) {
  return faker.datatype.number({
    max,
    min: 0,
    precision: 1,
  });
}

function getProductImage() {
  function getImage(id: number) {
    switch (id) {
      case 0:
        return faker.image.people(700, 700, true);

      case 1:
        return faker.image.technics(700, 700, true);

      case 2:
        return `https://source.unsplash.com/random/700x700`;

      default:
        return faker.image.nature(700, 700, true);
    }
  }

  return getImage(getRandomInteger(2));
}

function createFakeProduct(): Product {
  return {
    id: getId(),
    name: faker.commerce.productName(),
    descriptions: [
      faker.commerce.productAdjective(),
      faker.commerce.productAdjective(),
    ],
    image: getProductImage(),
    department: faker.commerce.department(),
    price: faker.commerce.price(),
  };
}

function createFakeProducts(count: number) {
  const products = [];

  for (let index = 0; index < count; index++) {
    products.push(createFakeProduct());
  }

  return products;
}

function associateRelatedProducts(
  product: Product,
  _: any,
  products: Product[]
) {
  const productsInSameDepartment = products.filter(
    (p) => p.department === product.department && p !== product
  );
  const relatedProducts = Array.from(
    { length: getRandomInteger(Math.min(productsInSameDepartment.length, 5)) },
    () =>
      productsInSameDepartment[
        getRandomInteger(productsInSameDepartment.length - 1)
      ].id
  );
  return Object.assign({}, product, {
    related: relatedProducts.filter(
      (p, index, array) => array.indexOf(p) === index
    ),
  });
}

const Image_Size = {
  standard: {
    w: 600,
    h: 600,
  },
  thumb: {
    w: 188,
    h: 188,
  },
};

function getProductImageData(product: Product) {
  return {
    imagePath:
      product.image &&
      (isUrl(product.image)
        ? product.image
        : path.resolve(__dirname, '..', 'images', product.image)),
    options: [
      {
        name: 'standard',
        width: Image_Size.standard.w,
        height: Image_Size.standard.h,
        format: 'jpg',
      },
      {
        name: 'webp',
        width: Image_Size.standard.w,
        height: Image_Size.standard.h,
        format: 'webp',
      },
      {
        name: 'thumbStandard',
        width: Image_Size.thumb.w,
        height: Image_Size.thumb.h,
        format: 'jpg',
      },
      {
        name: 'thumbWebp',
        width: Image_Size.thumb.w,
        height: Image_Size.thumb.h,
        format: 'webp',
      },
      {
        name: 'blur',
        width: Image_Size.standard.w,
        height: Image_Size.standard.h,
        format: 'jpg',
        blur: true,
      },
      {
        name: 'thumbBlur',
        width: Image_Size.thumb.w,
        height: Image_Size.thumb.h,
        format: 'jpg',
        blur: true,
      },
    ] as const,
  };
}

export function createProductDb(imageProcessor: ImageProcessor): ProductDto[] {
  const allProducts = products
    .concat(createFakeProducts(numOfProducts))
    .map(associateRelatedProducts);
  console.info(`Created all ${allProducts.length} products.`);

  const result: ProductDto[] = [];
  for (const product of allProducts) {
    if (product.image) {
      const imageData = getProductImageData(product);
      const imageInfo: ProductImageInfo = {};
      let smallImagePath: string | null = null;
      imageData.options.forEach((option) => {
        const imageFileName = `${_.kebabCase(product.name)}.${
          'blur' in option ? 'blur' : 'ori'
        }.${option.height}x${option.width}.${option.format}`;

        const outputPath = `${imageOutputFolder}/${imageFileName}`;

        imageProcessor.addImage({
          imagePath: imageData.imagePath,
          outputPath,
          option,
        });
        imageInfo[option.name] = `${imagePublicPath}${imageFileName}`;
        if (option.name === 'thumbStandard') {
          smallImagePath = outputPath;
        }
      });
      result.push({
        ...product,
        images: imageInfo,
        smallImagePath,
      });
    } else {
      result.push({
        ...product,
        images: null,
        smallImagePath: null,
      });
    }
  }

  return result;
}
