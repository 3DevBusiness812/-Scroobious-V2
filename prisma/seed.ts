import { prisma } from './client';
import { run as createL2ReviewerQuickLogin } from './seeds/l2ReviewerQuickLogin'

//
// Seeds should be run locally only, to get you started quickly
//

async function main() {
  console.log(`Running Prisma seeds...`)

  await createL2ReviewerQuickLogin()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
