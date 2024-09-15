import { MediaType } from '@core/common/enums/media-enums';
import { Readable } from 'stream';

export type CreateMediaPort = {
  executorId: string;
  name: string;
  type: MediaType;
  file: Buffer | Readable;
};
