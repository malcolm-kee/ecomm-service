import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { Sharp } from 'sharp';
import sharp from 'sharp';
import { request } from 'undici';
import { isUrl } from './lib/is-url';
import { GenerateImageOption } from './type';

export function getSharp(imagePath: string): Promise<Sharp> {
  if (isUrl(imagePath)) {
    const tempFile = path.join(os.tmpdir(), `temp-${Date.now()}.jpg`);
    const writeStream = fs.createWriteStream(tempFile);

    return request(imagePath).then((res) => {
      res.body.pipe(writeStream);
      return new Promise<Sharp>((resolve, reject) => {
        writeStream.on('finish', () => {
          const newSharp = sharp(tempFile);
          resolve(newSharp);
        });
        writeStream.on('error', reject);
      });
    });
  }

  return Promise.resolve(sharp(imagePath));
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
