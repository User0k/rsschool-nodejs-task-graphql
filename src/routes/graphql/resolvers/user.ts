import { GraphQLNonNull, GraphQLList } from 'graphql';
import { UserType } from '../types/user.js';
import { UUIDType } from '../types/uuid.js';
import { Args, Context } from './_interfaces.js';

export const userListResolver = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
  async resolve(_, __, { prisma }: Context) {
    return prisma.user.findMany({
      include: {
        profile: {
          include: {
            memberType: true,
          },
        },
        posts: true,
      },
    });
  },
};

export const userResolver = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  async resolve(_, args: Args, { prisma }: Context) {
    return prisma.user.findUnique({
      where: { id: args.id },
      include: {
        profile: {
          include: {
            memberType: true,
          },
        },
        posts: true,
      },
    });
  },
};
