import { router, publicProcedure } from '../trpc';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { env } from '~/env.mjs';
import { prisma } from '~/server/prisma';
import { nanoid } from 'nanoid';
import { sendEmailFromTemplate } from '~/utils/customerio';
import SecurePassword from 'secure-password';
import { error } from '~/utils/logger';
import { resetPasswordInput, createPasswordResetInput } from '~/server/input';

const SP = new SecurePassword();

const ANONYMOUS_USER_ID = '2';

const passwordResetSelect = Prisma.validator<Prisma.PasswordResetSelect>()({
  email: true,
  id: true,
  expiresAt: true
});

const userSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true
});

export const authRouter = router({
  isValidResetToken: publicProcedure
    .input(
      z.object({
        token: z.string().length(64),
      })
    )
    .query(async ({ input: { token } }) => {
      try {
        await prisma.passwordReset.findFirstOrThrow({
          where: {
            token,
            status: "OPEN",
            expiresAt: {
              gt: new Date()
            }
          },
        });

        return true
      } catch (err) {
        return false;
      }
    }),
  resetPassword: publicProcedure
    .input(resetPasswordInput)
    .mutation(async ({ input: { password, token } }) => {
      try {
        const { email } = await prisma.passwordReset.findFirstOrThrow({
          where: {
            token,
            status: "OPEN",
            expiresAt: {
              gt: new Date()
            }
          },
          select: passwordResetSelect,
        });

        const hashedBuffer = await SP.hash(Buffer.from(password));
        const hashedString = hashedBuffer.toString('base64');

        const [user, passwordReset] = await prisma.$transaction([
          prisma.user.update({
            where: { email },
            data: { password: hashedString },
            select: userSelect
          }),
          prisma.passwordReset.update({
            where: { token },
            data: {
              status: "COMPLETE",
              updatedById: ANONYMOUS_USER_ID,
              updatedAt: new Date(),
              version: {
                increment: 1
              }
            }
          }),
        ])

        return true;
      } catch (err) {
        error(err);
        return false;
      }
    }),
  createPasswordReset: publicProcedure
    .input(createPasswordResetInput)
    .mutation(async ({ input: { email: inputEmail } }) => {
      const email = inputEmail.toLowerCase();

      try {
        await prisma.user.findFirstOrThrow({ where: { email } });
        const token = nanoid(64);

        const passwordReset = await prisma.passwordReset.create({
          data: {
            email,
            createdById: ANONYMOUS_USER_ID,
            version: 1,
            ownerId: ANONYMOUS_USER_ID,
            status: "OPEN",
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
            token
          },
          select: passwordResetSelect,
        });

        await sendEmailFromTemplate({
          to: email,
          templateId: '6',
          data: {
            url: `${env.NEXT_PUBLIC_APP_BASE_URL}/auth/password-reset?token=${token}`
          }
        });

        return passwordReset
      } catch (err) {
        return null
      }
    })
});
