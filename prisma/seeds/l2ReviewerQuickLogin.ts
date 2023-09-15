import { prisma } from '../client';
import SecurePassword from 'secure-password';

const SP = new SecurePassword();

const hashPassword = async (password: string) => {
  if (typeof password !== 'string') {
    throw new Error(`Error Hashing password ${password}`);
  }

  const hashedBuffer = await SP.hash(Buffer.from(password));
  const hashedString = hashedBuffer.toString('base64');
  return hashedString;
}

export async function run() {
  const ownerId = "1";
  const createdById = "1";
  const version = 1;

  const defaultReqCols = {
    ownerId,
    createdById,
    version
  }

  const l2ReviewerRole = await prisma.role.findFirstOrThrow({
    where: { code: 'l2-reviewer' }
  });

  const l2ReviewerUserType = await prisma.userType.findFirstOrThrow({
    where: { type: 'L2_REVIEWER' }
  });

  const l2Reviewer = await prisma.user.upsert({
    where: { email: 'l2reviewer@scroobious.com' },
    update: {},
    create: {
      ...defaultReqCols,
      email: 'l2reviewer@scroobious.com',
      name: 'L2 Reviewer',
      password: (await hashPassword("asdfasdf")),
      status: 'ACTIVE',
      capabilities: [l2ReviewerUserType.type],
      profilePicture: {
        create: {
          createdById,
          ownerId,
          version,
          url: "https://scroobious-app-production.s3.us-west-2.amazonaws.com/user-no-profile-picture.png" // profile pic is required for now :(
        }
      }
    },
  });

  //
  // create role for l2Reviewer if it doesn't exist
  //
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        roleId: l2ReviewerRole.id,
        userId: l2Reviewer.id
      }
    },
    update: {},
    create: {
      ...defaultReqCols,
      roleId: l2ReviewerRole.id,
      userId: l2Reviewer.id
    }
  });
}
