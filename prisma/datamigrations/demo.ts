import { prisma } from '../client';
import { StateProvince } from '@prisma/client'

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
export async function run() {
  const [state] = await prisma.$queryRaw<StateProvince[]>`SELECT * FROM state_province ORDER BY RANDOM() LIMIT 1`;
  console.log(`Data migration says :>> the best US State for today is ${state?.description}`)
}
