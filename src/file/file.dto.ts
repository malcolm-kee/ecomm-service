import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponse {
  @ApiProperty({
    description: 'Public URL for the uploaded file',
  })
  filePath: string;
}
