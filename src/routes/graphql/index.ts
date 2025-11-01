import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { memberListResolver, memberResolver } from './resolvers/member.js';
import { postListResolver, postResolver } from './resolvers/post.js';
import { profileListResolver, profileResolver } from './resolvers/profile.js';
import { userListResolver, userResolver } from './resolvers/user.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
      memberTypes: memberListResolver,
      memberType: memberResolver,
      posts: postListResolver,
      post: postResolver,
      profiles: profileListResolver,
      profile: profileResolver,
      users: userListResolver,
      user: userResolver,
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
