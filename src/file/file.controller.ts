import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBody, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileService } from './file.service';
import { UploadFileInfo, UPLOAD_FOLDER } from './file.type';
import { PUBLIC_PATH } from '../constants';

@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(private readonly service: FileService) {}

  @ApiOperation({
    summary: 'Upload a file',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: `${PUBLIC_PATH}/${UPLOAD_FOLDER}`,
    })
  )
  async uploadFile(@UploadedFile() file: UploadFileInfo) {
    const filePath = await this.service.renameFile(file);
    return {
      filePath,
    };
  }
}
