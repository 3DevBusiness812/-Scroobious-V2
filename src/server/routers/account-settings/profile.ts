import { publicProcedure, authedProcedure } from '~/server/trpc';
import SecurePassword from 'secure-password';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { updatePasswordInput, updateProfileInput } from '~/server/input';
import { prisma } from '~/server/prisma';
import { createUploadSignedUrl } from '~/utils/s3';
import { error } from '~/utils/logger';

const SP = new SecurePassword();

const userUpdatePasswordSelect = Prisma.validator<Prisma.UserSelect>()({
  password: true
});

export default {
  getSignedUploadUrl: authedProcedure
    .input(
      z.object({
        fileName: z.string().min(3)
      })
    )
    .mutation(async ({ input: { fileName } }) => {
      const url = await createUploadSignedUrl(fileName)
      return url;
    }),
  updateProfilePicture: authedProcedure
    .input(
      z.object({
        url: z.string().url()
      })
    )
    .mutation(async ({ input: { url }, ctx }) => {
      await prisma.user.update({
        where: {
          id: ctx.user.id
        },
        data: {
          profilePicture: {
            create: {
              version: 1,
              createdById: ctx.user.id!,
              ownerId: ctx.user.id!,
              url
            }
          }
        },
      })
    }),
  updateProfile: authedProcedure
    .input(updateProfileInput)
    .mutation(async ({ input: { name }, ctx }) => {
      const [firstName] = name.split(" ");

      await prisma.user.update({
        where: {
          id: ctx.user.id
        },
        data: {
          version: { increment: 1 },
          updatedById: ctx.user.id!,
          updatedAt: new Date(),
          name,
          firstName
        }
      })
    }),
  updatePassword: authedProcedure
    .input(updatePasswordInput)
    .mutation(async ({ input: { password, oldPassword }, ctx }) => {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: ctx.user.id },
        select: userUpdatePasswordSelect
      });

      const { password: hashedPassword } = user ?? {};

      try {
        if (!hashedPassword)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Invalid user",
          });

        const hashVerifyResult = await SP.verify(
          Buffer.from(oldPassword),
          Buffer.from(hashedPassword, 'base64')
        );

        if (hashVerifyResult !== SecurePassword.VALID)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid password",
          });

        const hashedBuffer = await SP.hash(Buffer.from(password));
        const hashedString = hashedBuffer.toString('base64');

        await prisma.user.update({
          where: { id: ctx.user.id },
          data: { password: hashedString }
        });
      } catch (err) {
        error(err);

        if (err instanceof TRPCError) {
          throw err
        } else {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Failed changing password`,
          });
        }
      }
    })
}
