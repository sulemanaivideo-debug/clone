import { z } from 'zod';
import { insertEmailSchema, emails } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  emails: {
    list: {
      method: 'GET' as const,
      path: '/api/emails',
      responses: {
        200: z.array(z.custom<typeof emails.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/emails/:id',
      responses: {
        200: z.custom<typeof emails.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/emails',
      input: insertEmailSchema,
      responses: {
        201: z.custom<typeof emails.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    toggleStar: {
      method: 'PATCH' as const,
      path: '/api/emails/:id/star',
      input: z.object({ isStarred: z.boolean() }),
      responses: {
        200: z.custom<typeof emails.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type EmailInput = z.infer<typeof api.emails.create.input>;
export type EmailResponse = z.infer<typeof api.emails.create.responses[201]>;
export type EmailsListResponse = z.infer<typeof api.emails.list.responses[200]>;
