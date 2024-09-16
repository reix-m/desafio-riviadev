import { MediaType } from '@core/common/enums/media-enums';
import { MediaRemovedEvent } from '@core/common/message/event/events/media/media-removed-event';
import { randomUUID } from 'crypto';

describe('MediaRemovedEvent', () => {
  describe('new', () => {
    test('should create MediaRemovedEvent with required parameters', () => {
      const mediaId: string = randomUUID();
      const ownerId: string = randomUUID();
      const mediaType: MediaType = MediaType.Image;

      const mediaRemovedEvent: MediaRemovedEvent = MediaRemovedEvent.new(mediaId, ownerId, mediaType);

      expect(mediaRemovedEvent.mediaId).toBe(mediaId);
      expect(mediaRemovedEvent.ownerId).toBe(ownerId);
      expect(mediaRemovedEvent.type).toBe(mediaType);
    });
  });
});
