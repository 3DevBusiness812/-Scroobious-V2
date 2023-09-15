import { prisma } from './client';
import { run as demo } from './datamigrations/demo'

//
// IMPORTANT:
// Data migrations also run on production, so use with caution!!!
//
// We don't keep them in migration history so make sure you're altering data carefully. For example, 
// if you need to insert data, use prisma's `upsert` instead of `create`, with an empty `update`
// ```
// await prisma.someModel.upsert({
//  where: { some: 'condition', goes: 'here' },
//  update: {},
//  create: {
//   ...data
//  }
// }
// ```
// otherwise we'll just keep creating records in the DB.
//
// Also be aware that data migrations run after the schema migrations in `../migrations`
//
async function main() {
  console.log(`Running Prisma's data migrations...`)

  await demo();
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
