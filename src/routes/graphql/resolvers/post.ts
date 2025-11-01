import { GraphQLNonNull, GraphQLList } from 'graphql';
import { PostType } from '../types/post.js';
import { UUIDType } from '../types/uuid.js';
import { Args, Context } from './_interfaces.js';

export const postListResolver = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
  async resolve(_, __, { prisma }: Context) {
    return await prisma.post.findMany();
  },
};

export const postResolver = {
  type: PostType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  async resolve(_, args: Args, { prisma }: Context) {
    return await prisma.post.findUnique({
      where: { id: args.id },
    });
  },
};
