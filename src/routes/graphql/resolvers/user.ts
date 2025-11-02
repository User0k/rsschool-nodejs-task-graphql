import { GraphQLNonNull, GraphQLList, GraphQLString } from 'graphql';
import { UserType } from '../types/user.js';
import { UUIDType } from '../types/uuid.js';
import { Args, Context } from './_interfaces.js';
import { ChangeUserInput, CreateUserInput } from '../types/user_input.js';
import { Prisma } from '@prisma/client';

export const userListResolverQuery = {
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

export const userResolverQuery = {
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

export const createUserResolver = {
  type: new GraphQLNonNull(UserType),
  args: {
    dto: { type: new GraphQLNonNull(CreateUserInput) },
  },
  async resolve(_, args: { dto: Prisma.UserCreateInput }, { prisma }: Context) {
    return await prisma.user.create({
      data: args.dto,
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

interface UpdateArgs extends Args {
  dto: Prisma.UserUpdateInput;
}

export const changeUserResolver = {
  type: new GraphQLNonNull(UserType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeUserInput) },
  },
  async resolve(_, args: UpdateArgs, { prisma }: Context) {
    return await prisma.user.update({
      where: { id: args.id },
      data: args.dto,
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

export const deleteUserResolver = {
  type: new GraphQLNonNull(GraphQLString),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  async resolve(_, args: Args, { prisma }: Context) {
    await prisma.user.delete({
      where: { id: args.id },
    });
    return 'User deleted successfully';
  },
};
