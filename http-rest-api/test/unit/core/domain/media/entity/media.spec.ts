import { MediaType } from '@core/common/enums/media-enums';
import { Media } from '@core/domain/media/entity/media';
import { CreateMediaEntityPayload } from '@core/domain/media/entity/type/create-media-entity-payload';
import { FileMetadata } from '@core/domain/media/value-object/file-metadata';
import { CreateFileMetadataValueObjectPayload } from '@core/domain/media/value-object/type/create-file-metadata-value-object-payload';
import { randomUUID } from 'crypto';

describe('Media', () => {
  describe('new', () => {
    test('should create media with default parameters when input optional args are empty', async () => {
      jest.useFakeTimers();

      const currentDate: number = Date.now();

      const createFileMetadataValueObjectPayload: CreateFileMetadataValueObjectPayload = {
        relativePath: '/relative/path',
      };

      const createMediaEntityPayload: CreateMediaEntityPayload = {
        ownerId: randomUUID(),
        name: 'Product image',
        type: MediaType.Image,
        metadata: await FileMetadata.new(createFileMetadataValueObjectPayload),
      };

      const media: Media = await Media.new(createMediaEntityPayload);

      expect(typeof media.getId() === 'string').toBeTruthy();
      expect(media.getOwnerId()).toBe(createMediaEntityPayload.ownerId);
      expect(media.getName()).toBe(createMediaEntityPayload.name);
      expect(media.getType()).toBe(createMediaEntityPayload.type);
      expect(media.getMetadata()).toBeInstanceOf(FileMetadata);
      expect(media.getMetadata().getRelativePath()).toBe(createFileMetadataValueObjectPayload.relativePath);
      expect(media.getCreatedAt().getTime()).toBe(currentDate);
      expect(media.getRemovedAt()).toBeNull();
      expect(media.getUpdatedAt()).toBeNull();

      jest.useRealTimers();
    });

    test('should create media with custom parameters when input optional args are set', async () => {
      jest.useFakeTimers();

      const customId: string = randomUUID();
      const customCreatedAt: Date = new Date(Date.now() - 20000);
      const customUpdatedAt: Date = new Date(Date.now() - 7000);
      const customRemovedAt: Date = new Date(Date.now() - 2000);

      const createFileMetadataValueObjectPayload: CreateFileMetadataValueObjectPayload = {
        relativePath: '/relative/path',
        size: 10,
        ext: 'png',
        mimetype: 'image/png',
      };

      const createMediaEntityPayload: CreateMediaEntityPayload = {
        ownerId: randomUUID(),
        name: 'Product Image',
        type: MediaType.Image,
        metadata: await FileMetadata.new(createFileMetadataValueObjectPayload),
        id: customId,
        createdAt: customCreatedAt,
        updatedAt: customUpdatedAt,
        removedAt: customRemovedAt,
      };

      const media: Media = await Media.new(createMediaEntityPayload);

      expect(media.getId()).toBe(customId);
      expect(media.getOwnerId()).toBe(createMediaEntityPayload.ownerId);
      expect(media.getName()).toBe(createMediaEntityPayload.name);
      expect(media.getType()).toBe(createMediaEntityPayload.type);
      expect(media.getMetadata()).toBeInstanceOf(FileMetadata);
      expect(media.getMetadata().getRelativePath()).toBe(createFileMetadataValueObjectPayload.relativePath);
      expect(media.getMetadata().getExt()).toBe(createFileMetadataValueObjectPayload.ext);
      expect(media.getMetadata().getSize()).toBe(createFileMetadataValueObjectPayload.size);
      expect(media.getMetadata().getMimetype()).toBe(createFileMetadataValueObjectPayload.mimetype);
      expect(media.getCreatedAt()).toBe(customCreatedAt);
      expect(media.getUpdatedAt()).toBe(customUpdatedAt);
      expect(media.getRemovedAt()).toBe(customRemovedAt);

      jest.useRealTimers();
    });
  });

  describe('remove', () => {
    test('should marks media as removed', async () => {
      jest.useFakeTimers();

      const currentDate: number = Date.now();

      const media: Media = await Media.new({
        ownerId: randomUUID(),
        name: randomUUID(),
        type: MediaType.Image,
        metadata: await FileMetadata.new({ relativePath: '/relative/path' }),
      });

      await media.remove();

      expect(media.getRemovedAt()!.getTime()).toBe(currentDate);
    });
  });

  describe('edit', () => {
    test('should not edit Media when input args are empty', async () => {
      const media: Media = await Media.new({
        ownerId: randomUUID(),
        name: 'Product Image',
        type: MediaType.Image,
        metadata: await FileMetadata.new({ relativePath: '/relative/path' }),
      });

      await media.edit({});

      const expectedMetadata: Record<string, unknown> = {
        relativePath: '/relative/path',
        size: null,
        ext: null,
        mimetype: null,
      };

      expect(media.getName()).toBe('Product Image');
      expect(media.getMetadata().getRelativePath()).toBe(expectedMetadata.relativePath);
      expect(media.getMetadata().getSize()).toBe(expectedMetadata.size);
      expect(media.getMetadata().getExt()).toBe(expectedMetadata.ext);
      expect(media.getMetadata().getMimetype()).toBe(expectedMetadata.mimetype);
      expect(media.getUpdatedAt()).toBeNull();
    });

    test('should edit Media when input args are set', async () => {
      jest.useFakeTimers();

      const currentDate: number = Date.now();

      const media: Media = await Media.new({
        ownerId: randomUUID(),
        name: 'Product Image',
        type: MediaType.Image,
        metadata: await FileMetadata.new({ relativePath: '/relative/path' }),
      });

      await media.edit({
        name: 'New Product Image',
        metadata: await FileMetadata.new({ relativePath: '/new/relative/path' }),
      });

      const expectedMetadata: Record<string, unknown> = {
        relativePath: '/new/relative/path',
        size: null,
        ext: null,
        mimetype: null,
      };

      expect(media.getName()).toBe('New Product Image');
      expect(media.getMetadata().getRelativePath()).toBe(expectedMetadata.relativePath);
      expect(media.getMetadata().getSize()).toBe(expectedMetadata.size);
      expect(media.getMetadata().getExt()).toBe(expectedMetadata.ext);
      expect(media.getMetadata().getMimetype()).toBe(expectedMetadata.mimetype);
      expect(media.getUpdatedAt()!.getTime()).toBe(currentDate);

      jest.useRealTimers();
    });
  });
});
