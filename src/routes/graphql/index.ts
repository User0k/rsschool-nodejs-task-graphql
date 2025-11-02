import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { memberListResolverQuery, memberResolverQuery } from './resolvers/member.js';
import {
  changePostResolver,
  createPostResolver,
  deletePostResolver,
  postListResolverQuery,
  postResolverQuery,
} from './resolvers/post.js';
import {
  changeProfileResolver,
  createProfileResolver,
  deleteProfileResolver,
  profileListResolverQuery,
  profileResolverQuery,
} from './resolvers/profile.js';
import {
  changeUserResolver,
  createUserResolver,
  deleteUserResolver,
  userListResolverQuery,
  userResolverQuery,
} from './resolvers/user.js';
import {
  subscribeToResolver,
  unsubscribeFromResolver,
} from './resolvers/subscription.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
      memberTypes: memberListResolverQuery,
      memberType: memberResolverQuery,
      posts: postListResolverQuery,
      post: postResolverQuery,
      profiles: profileListResolverQuery,
      profile: profileResolverQuery,
      users: userListResolverQuery,
      user: userResolverQuery,
    },
  });

  const MutationsType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createUser: createUserResolver,
      createProfile: createProfileResolver,
      createPost: createPostResolver,
      changeUser: changeUserResolver,
      changeProfile: changeProfileResolver,
      changePost: changePostResolver,
      deleteUser: deleteUserResolver,
      deleteProfile: deleteProfileResolver,
      deletePost: deletePostResolver,
      subscribeTo: subscribeToResolver,
      unsubscribeFrom: unsubscribeFromResolver,
    },
  });

  const schema = new GraphQLSchema({
    query: QueryType,
    mutation: MutationsType,
  });

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      return graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: {
          prisma,
        },
      });
    },
  });
};

export default plugin;
