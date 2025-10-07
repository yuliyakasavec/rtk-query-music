import {
  currentUserReactionSchema,
  imagesSchema,
  userSchema,
} from '@/common/schemas';
import * as z from 'zod';

export const trackAttachmentSchema = z.object({
  id: z.string(),
  addedAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  version: z.int().nonnegative(),
  url: z.url(),
  contentType: z.string(),
  originalName: z.string(),
  fileSize: z.int().nonnegative(),
});

export const trackRelationshipsSchema = z.object({
  artists: z.object({
    data: z.array(
      z.object({
        id: z.string(),
        type: z.literal('artists'),
      })
    ),
  }),
});

export const trackAttributesSchema = z.object({
  title: z.string(),
  addedAt: z.iso.datetime(),
  attachments: z.array(trackAttachmentSchema),
  images: imagesSchema,
  currentUserReaction: currentUserReactionSchema,
  user: userSchema,
  isPublished: z.boolean(),
  publishedAt: z.iso.datetime(),
});

export const tracksMetaSchema = z.object({
  nextCursor: z.string().nullable(),
  page: z.int().positive(),
  pageSize: z.int().positive(),
  totalCount: z.int().positive().nullable(),
  pagesCount: z.int().positive().nullable(),
});

export const tracksIncludedSchema = z.object({
  id: z.string(),
  type: z.literal('artists'),
  attributes: {
    name: z.string(),
  },
});

export const trackDataSchema = z.object({
  id: z.string(),
  type: z.literal('tracks'),
  attributes: trackAttributesSchema,
  relationships: trackRelationshipsSchema,
});

export const fetchTracksResponseSchema = z.object({
  data: z.array(trackDataSchema),
  included: z.array(tracksIncludedSchema),
  meta: tracksMetaSchema,
});
