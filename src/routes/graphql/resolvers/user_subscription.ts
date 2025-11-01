import type { Context } from './_interfaces.js';

export async function resolveUserSubscribedTo(
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

export async function resolveSubscribedToUser(
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
