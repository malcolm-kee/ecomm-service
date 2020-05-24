export type UploadFileInfo = {
  fieldName: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
};

export const UPLOAD_FOLDER = 'upload';
