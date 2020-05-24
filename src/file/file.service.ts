import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as db from 'mime-db';
import * as path from 'path';
import { UploadFileInfo, UPLOAD_FOLDER } from './file.type';
import { ConfigService } from '@nestjs/config';

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
    const APP_NAME = this.configService.get('HEROKU_APP_NAME');
    const PORT = this.configService.get('PORT') || 3000;

    return APP_NAME
      ? `https://${APP_NAME}.herokuapp.com`
      : `http://localhost:${PORT}`;
  }
}
