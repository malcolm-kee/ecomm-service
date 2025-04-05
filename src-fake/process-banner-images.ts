import { glob } from 'glob';
import { imageOutputFolder, imagePublicPath } from './constants';
import { ImageProcessor } from './image-processor';
import { BannerInfo, GenerateImageOption } from './type';

const bannerImageOptions: GenerateImageOption[] = [
  {
    width: 2500,
    height: 1000,
    fit: 'cover',
    format: 'jpg',
    position: 'top',
  },
  {
    width: 1242,
    height: 400,
    fit: 'cover',
    format: 'jpg',
    position: 'top',
  },
  {
    width: 700,
    height: 350,
    fit: 'cover',
    format: 'jpg',
    position: 'top',
  },
  {
    width: 500,
    height: 200,
    fit: 'cover',
    format: 'jpg',
    position: 'top',
  },
];

export async function processBannerImages(
  imgProcessor: ImageProcessor
): Promise<BannerInfo[]> {
  const files = await glob(__dirname + '/../images/banner**.jpg');
  const result: BannerInfo[] = [];

  for (let index = 0; index < files.length; index++) {
    const bannerImgPath = files[index];
    const bannerInfo: BannerInfo = {};

    bannerImageOptions.forEach((option) => {
      const imgName = `banner-${index}.${option.height}x${option.width}.${option.format}`;

      const blurImgName = `banner-${index}-blur.${option.height}x${option.width}.${option.format}`;

      imgProcessor.addImage({
        imagePath: bannerImgPath,
        outputPath: `${imageOutputFolder}/${imgName}`,
        option,
      });
      imgProcessor.addImage({
        imagePath: bannerImgPath,
        outputPath: `${imageOutputFolder}/${blurImgName}`,
        option: {
          ...option,
          blur: true,
        },
      });

      bannerInfo[option.width] = `${imagePublicPath}${imgName}`;
      bannerInfo[`${option.width}Blur`] = `${imagePublicPath}${blurImgName}`;
    });
    result.push(bannerInfo);
  }

  return result;
}
