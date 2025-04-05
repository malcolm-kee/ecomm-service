import { Buffer } from 'node:buffer';
import sharp, { Sharp } from 'sharp';
import { request } from 'undici';
import { isUrl } from './lib/is-url';
import { GenerateImageOption } from './type';

export function getSharp(imagePath: string) {
  return new Promise<Sharp>((fulfill, reject) => {
    if (isUrl(imagePath)) {
      request(imagePath)
        .then((res) => res.body.arrayBuffer())
        .then((imageArrBuffer) => {
          const buffer = Buffer.from(imageArrBuffer);
          const newSharp = sharp(buffer);
          return fulfill(newSharp);
        })
        .catch(reject);
    } else {
      const newSharp = sharp(imagePath);
      return fulfill(newSharp);
    }
  });
}

export async function generateImage(
  img: Sharp,
  {
    width,
    height,
    format,
    blur = false,
    fit = 'contain',
    position,
  }: GenerateImageOption
) {
  if (!blur) {
    const sharp = img.clone().resize(width, height, {
      fit,
      position,
      background: 'rgb(255,255,255)',
    });

    return {
      width,
      height,
      format,
      blur,
      buffer:
        format === 'jpg'
          ? await compressJpg(sharp, { quality: 100 })
          : await compressWebp(sharp, { quality: 100 }),
    };
  }

  const sharp = img.clone().resize(width, height, {
    fit,
    position,
    background: 'rgb(255,255,255)',
    kernel: 'cubic',
  });

  const compressedBuffer =
    format === 'jpg' ? await compressJpg(sharp) : await compressWebp(sharp);

  return {
    width,
    height,
    format,
    blur,
    buffer: compressedBuffer,
  };

  function compressJpg(pipeline: Sharp, { quality = 30 } = {}) {
    return pipeline
      .jpeg({
        quality,
        progressive: true,
      })
      .toBuffer();
  }

  function compressWebp(pipeline: Sharp, { quality = 5 } = {}) {
    return pipeline
      .webp({
        quality,
      })
      .toBuffer();
  }
}
