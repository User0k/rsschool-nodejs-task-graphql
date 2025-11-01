import { GraphQLNonNull, GraphQLList } from 'graphql';
import { ProfileType } from '../types/profile.js';
import { UUIDType } from '../types/uuid.js';
import { Args, Context } from './_interfaces.js';

export const profileListResolver = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
  async resolve(_, __, { prisma }: Context) {
    return await prisma.profile.findMany({
      include: {
        memberType: true,
      },
    });
  },
};

export const profileResolver = {
  type: ProfileType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  async resolve(_, args: Args, { prisma }: Context) {
    return await prisma.profile.findUnique({
      where: { id: args.id },
      include: {
        memberType: true,
      },
    });
  },
};
