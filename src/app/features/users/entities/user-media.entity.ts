import { UserMedia } from '@prisma/client';

export class UserMediaEntity implements UserMedia {
  constructor(partial: Partial<UserMediaEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  userId: number;
  mimetype: string;
  key: string;
  originalName: string;
  name: string;
  updatedAt: Date;
  createdAt: Date;
}
