import { GraphQLNonNull, GraphQLString } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { Context } from './_interfaces.js';

interface SubscribeArgs {
  userId: string;
  authorId: string;
}

export const subscribeToResolver = {
  type: new GraphQLNonNull(GraphQLString),
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  async resolve(_, args: SubscribeArgs, { prisma }: Context) {
    await prisma.subscribersOnAuthors.create({
      data: {
        subscriberId: args.userId,
        authorId: args.authorId,
      },
    });
    return 'Subscribed successfully';
  },
};

export const unsubscribeFromResolver = {
  type: new GraphQLNonNull(GraphQLString),
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  async resolve(_, args: SubscribeArgs, { prisma }: Context) {
    await prisma.subscribersOnAuthors.delete({
      where: {
        subscriberId_authorId: {
          subscriberId: args.userId,
          authorId: args.authorId,
        },
      },
    });
    return 'Unsubscribed successfully';
  },
};
