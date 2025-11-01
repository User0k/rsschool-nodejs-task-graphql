import type { PrismaClient } from '@prisma/client';

export interface Args {
  id: string;
}

export interface Context {
  prisma: PrismaClient;
}
