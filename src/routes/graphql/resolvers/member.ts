import { GraphQLNonNull, GraphQLList } from 'graphql';
import { MemberType, MemberTypeId } from '../types/member.js';
import { Args, Context } from './_interfaces.js';

export const memberListResolverQuery = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
  async resolve(_, __, { prisma }: Context) {
    return await prisma.memberType.findMany();
  },
};

export const memberResolverQuery = {
  type: MemberType,
  args: {
    id: { type: new GraphQLNonNull(MemberTypeId) },
  },
  async resolve(_, args: Args, { prisma }: Context) {
    return await prisma.memberType.findUnique({
      where: { id: args.id },
    });
  },
};
