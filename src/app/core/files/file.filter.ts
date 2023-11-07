import { UnsupportedMediaTypeException } from '@nestjs/common';

export function fileMimetypeFilter(mimetypes: string[]) {
  return (
    req,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!mimetypes.some((m) => file.mimetype.includes(m))) {
      callback(
        new UnsupportedMediaTypeException(
          `File type is not matching: ${mimetypes.join(', ')}`,
        ),
        false,
      );
    } else {
      callback(null, true);
    }
  };
}
