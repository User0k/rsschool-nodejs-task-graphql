import { GraphQLNonNull, GraphQLList, GraphQLString } from 'graphql';
import { PostType } from '../types/post.js';
import { UUIDType } from '../types/uuid.js';
import { Args, Context } from './_interfaces.js';
import { ChangePostInput, CreatePostInput } from '../types/post_input.js';
import { Prisma } from '@prisma/client';

export const postListResolverQuery = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
  async resolve(_, __, { prisma }: Context) {
    return await prisma.post.findMany();
  },
};

export const postResolverQuery = {
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

export const createPostResolver = {
  type: new GraphQLNonNull(PostType),
  args: {
    dto: { type: new GraphQLNonNull(CreatePostInput) },
  },
  async resolve(_, args: { dto: Prisma.PostCreateInput }, { prisma }: Context) {
    return await prisma.post.create({
      data: args.dto,
    });
  },
};

interface UpdateArgs extends Args {
  dto: Prisma.PostUpdateInput;
}

export const changePostResolver = {
  type: new GraphQLNonNull(PostType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangePostInput) },
  },
  async resolve(_, args: UpdateArgs, { prisma }: Context) {
    return await prisma.post.update({
      where: { id: args.id },
      data: args.dto,
    });
  },
};

export const deletePostResolver = {
  type: new GraphQLNonNull(GraphQLString),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  async resolve(_, args: Args, { prisma }: Context) {
    await prisma.post.delete({
      where: { id: args.id },
    });
    return 'Post deleted successfully';
  },
};
