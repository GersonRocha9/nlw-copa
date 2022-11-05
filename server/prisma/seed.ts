import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@gmail.com",
      avatarUrl: "https://avatars.githubusercontent.com/u/1780597?v=4",
    },
  });

  const pool = await prisma.pool.create({
    data: {
      title: "My first pool",
      code: "ABC123",
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-11-04T17:00:37.385Z",
      firstTeamCountryCode: "BR",
      secondTeamCountryCode: "AR",
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-11-07T17:00:37.385Z",
      firstTeamCountryCode: "ES",
      secondTeamCountryCode: "CA",

      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 1,
          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id,
              },
            },
          },
        },
      },
    },
  });
}

main();
