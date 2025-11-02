import { GraphQLNonNull, GraphQLList, GraphQLString } from 'graphql';
import { ProfileType } from '../types/profile.js';
import { UUIDType } from '../types/uuid.js';
import { Args, Context } from './_interfaces.js';
import { ChangeProfileInput, CreateProfileInput } from '../types/profile_input.js';
import { Prisma } from '@prisma/client';

export const profileListResolverQuery = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
  async resolve(_, __, { prisma }: Context) {
    return await prisma.profile.findMany({
      include: {
        memberType: true,
      },
    });
  },
};

export const profileResolverQuery = {
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

export const createProfileResolver = {
  type: new GraphQLNonNull(ProfileType),
  args: {
    dto: { type: new GraphQLNonNull(CreateProfileInput) },
  },
  async resolve(_, args: { dto: Prisma.ProfileCreateInput }, { prisma }: Context) {
    return await prisma.profile.create({
      data: args.dto,
      include: {
        memberType: true,
      },
    });
  },
};

interface UpdateArgs extends Args {
  dto: Prisma.ProfileUpdateInput;
}

export const changeProfileResolver = {
  type: new GraphQLNonNull(ProfileType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeProfileInput) },
  },
  async resolve(_, args: UpdateArgs, { prisma }: Context) {
    return await prisma.profile.update({
      where: { id: args.id },
      data: args.dto,
      include: {
        memberType: true,
      },
    });
  },
};

export const deleteProfileResolver = {
  type: new GraphQLNonNull(GraphQLString),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  async resolve(_, args: Args, { prisma }: Context) {
    await prisma.profile.delete({
      where: { id: args.id },
    });
    return 'Profile deleted successfully';
  },
};
