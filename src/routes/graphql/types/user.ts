import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profile.js';
import { PostType } from './post.js';
import { Context } from '../resolvers/_interfaces.js';

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: { type: ProfileType },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: resolveUserSubscribedTo,
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: resolveSubscribedToUser,
    },
  }),
});

async function resolveUserSubscribedTo(
  parent: { id: string },
  _: unknown,
  { prisma }: Context,
) {
  const subscriptions = await prisma.subscribersOnAuthors.findMany({
    where: { subscriberId: parent.id },
    include: {
      author: {
        include: {
          profile: {
            include: {
              memberType: true,
            },
          },
          posts: true,
        },
      },
    },
  });

  return subscriptions.map((sub) => sub.author);
}

async function resolveSubscribedToUser(
  parent: { id: string },
  _: unknown,
  { prisma }: Context,
) {
  const subscriptions = await prisma.subscribersOnAuthors.findMany({
    where: { authorId: parent.id },
    include: {
      subscriber: {
        include: {
          profile: {
            include: {
              memberType: true,
            },
          },
          posts: true,
        },
      },
    },
  });

  return subscriptions.map((sub) => sub.subscriber);
}
