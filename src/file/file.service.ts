import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import * as db from 'mime-db';
import * as path from 'path';

import { UPLOAD_FOLDER, UploadFileInfo } from './file.type';

@Injectable()
export class FileService {
  constructor(private readonly configService: ConfigService) {}

  async renameFile(file: UploadFileInfo) {
    const mimeInfo = db[file.mimetype];

    if (mimeInfo) {
      const targetFilePath = path.resolve(
        file.destination,
        `${file.filename}.${mimeInfo.extensions[0]}`
      );

      await fs.rename(file.path, targetFilePath);

      const pathInfo = path.parse(targetFilePath);

      return `${this.baseUrl}/${UPLOAD_FOLDER}/${pathInfo.base}`;
    } else {
      return file.path;
    }
  }

  private get baseUrl(): string {
    const FLY_APP_NAME = this.configService.get<string>('FLY_APP_NAME');
    const APP_NAME = this.configService.get<string>('HEROKU_APP_NAME');
    const PORT = this.configService.get<number>('PORT') || 3000;

    return FLY_APP_NAME
      ? `https://${FLY_APP_NAME}.fly.dev`
      : APP_NAME
        ? `https://${APP_NAME}.herokuapp.com`
        : `http://localhost:${PORT}`;
  }
}
