import { SetMetadata } from '@nestjs/common';

export const NO_AUTO_SERIALIZE = 'no_auto_serialize';

export const NoAutoSerialize = () => SetMetadata(NO_AUTO_SERIALIZE, true);
