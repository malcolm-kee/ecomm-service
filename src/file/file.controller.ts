import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PUBLIC_PATH } from '../constants';
import { UploadFileResponse } from './file.dto';
import { FileService } from './file.service';
import { UploadFileInfo, UPLOAD_FOLDER } from './file.type';

@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(private readonly service: FileService) {}

  @ApiOperation({
    summary: 'Upload a file',
    operationId: 'uploadFile',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
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
  @ApiResponse({
    status: 201,
    type: UploadFileResponse,
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
