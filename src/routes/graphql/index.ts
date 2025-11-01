import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { memberListResolverQuery, memberResolverQuery } from './resolvers/member.js';
import { postListResolverQuery, postResolverQuery } from './resolvers/post.js';
import { profileListResolverQuery, profileResolverQuery } from './resolvers/profile.js';
import { userListResolverQuery, userResolverQuery } from './resolvers/user.js';

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

  const schema = new GraphQLSchema({
    query: QueryType,
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
