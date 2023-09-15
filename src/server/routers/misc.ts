import { publicProcedure, router } from '~/server/trpc';
import { Prisma } from '@prisma/client';
import { prisma } from '~/server/prisma';

const stateProvinceSelect = Prisma.validator<Prisma.StateProvinceSelect>()({
  id: true,
  description: true
});

export const miscRouter = router({
  states: publicProcedure
    .query(async ({ input, ctx }) => {
      const items = await prisma.stateProvince.findMany({
        select: stateProvinceSelect,
        orderBy: { description: "asc" }
      });

      return items
    })
})
