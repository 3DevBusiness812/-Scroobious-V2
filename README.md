## Getting Started

Before start developing:

1. Make sure your local Scroobious postgres DB is up and running in Docker
2. Clone the repo `git clone git@github.com:scroobious/app-v2.git`
3. Create `.env` file in the root directory, like [env.example](./env.example) (`cp env.example .env`, sensitive values available in the `.env` files in the root and `./api` dirs of the [v1 Scroobious app](https://github.com/scroobious/app) or on Render):

4. Install packages `npm install`

5. If running for the first time, run the following command to mark the initial migration as applied (we already have all of that in the DB)
```bash 
npx prisma migrate resolve --applied 0_init
```

6. Run `npm run migrate` to apply the latest migrations (this should be run whenever migrations has been updated)

7. Finally run `npm run dev`

## Development notes

### Naming conventions
Per [Prisma naming conventions](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#naming-conventions) use `PascalCase` for naming models, and `camelCase` for naming model attributes. Per Postgres' naming conventions and recommendations, use `snake_case` names for the tables and table columns. Use Prisma's [`@map`](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#map) and [`@@map`](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#map-1) to map between naming conventions.
```prisma
model SomeModel {
  id              String        @id @default(nanoid())
  description     String
  createdAt       DateTime      @default(now()) @map("created_at") @db.Timestamptz(6) // @map("created_at") maps `SomeModel`'s attribute `createdAt` to Postgres `some_model` table column `created_at`
  createdById     String        @map("created_by_id")
  updatedAt       DateTime?     @default(now()) @map("updated_at") @db.Timestamptz(6)
  updatedById     String?       @map("updated_by_id")
  someRelationId  String
  someRelation    SomeRelation  @relation(fields: [someRelationId], references: [id], onDelete: NoAction, onUpdate: NoAction, )
  ...

  @@map("some_model") // maps Prisma's `SomeModel` to Postgres `some_model` table
}

model SomeRelation {
  id              String        @id @default(nanoid())
  someAttribute   String
  createdAt       DateTime      @default(now()) @map("created_at") @db.Timestamptz(6) 
  createdById     String        @map("created_by_id")
  updatedAt       DateTime?     @default(now()) @map("updated_at") @db.Timestamptz(6)
  updatedById     String?       @map("updated_by_id")
  ...

  @@map("some_relation")
```

### Migrations
Prisma automatically generates (**and applies!**) migrations from the schema changes. So for example, if we add the above Prisma model snippet to the existing [Prisma schema](./prisma/schema.prisma) file, and then run `npx prisma migrate dev`, Prisma will generate a migration based on the differences between the current data model (in DB) and the changes in the schema file, will save the migration as a SQL file in a separate directory prefixed with a unique timestamp in [`./prisma/migrations`](./prisma/migrations), and attempt to apply that migration to the DB. If Prisma detects some crucial changes that need recreating tables which may erase existing data will complain and ask for confirmation in order to proceed. Generally, after altering the schema file, it's a good practice to run `npx prisma migrate dev --create-only --name describe_your_migration`. This way Prisma only generates the migration in [`./prisma/migrations`](./prisma/migrations) without applying it, and that gives the opportunity to take a look at the migration before applying it, and even alter it if needed (sometimes that's even necessary.)

Prisma doesn't provide means to do "data" migrations with the Prisma client (with JS code). With Prisma migrations it's all SQL. So if apart of the schema changes, data migrations also need to be kept in the migrations history then they have to be done with SQL. To achieve that the following steps may be helpful:
- first run `npx prisma migrate dev --create-only --name describe_your_migration` — this will generate a migration with an empty `migration.sql` file
- update the `migration.sql` with the SQL statements (inserts, updates, deletes, selects etc.)
- run `npx prisma migrate dev` — this will apply the migration, or complain if anything goes wrong without applying the migration to the DB

See [an example of SQL data migrations](./prisma/migrations/20230221214448_add_l2_reviewer_role/migration.sql)

There's also the option to add/update/delete data imperatively, via [`./prisma/data.ts`](./prisma/data.ts). This gives access to a Prisma client, and comes with all the Prisma Typescript goodies, but be cautious and mindful about using it because this is something that executes on each deployment, so if not done properly (with proper `upserts`, for example, that do not add records everytime they run) may cause serious issues. Also note that these "data" migrations will run after Prisma's DB schema migrations (so after tables have been added/deleted/altered) These "data" migrations are available in [`./prisma/datamigrations/`](./prisma/datamigrations/) directory are executed via [`./prisma/data.ts`](./prisma/data.ts) 

There's also seeds available in [`./prisma/seeds/`](./prisma/seeds/) directory, to help developers getting started quickly, which are supposed to run only locally to prepopulate a development database. See [`./prisma/seed.ts`](./prisma/seed.ts) for more details.
### Logging
Use [logger's](./src/utils/logger.ts) `warn`, `info`, `log`, `error`, and `debug`, instead of `console.log` throughout the code. By default it's set to use `debug` logging level (on `staging`, local development etc.), and uses `info` on `production`, so if you want to debug things go ahead with `debug` which will safely avoid logging on production.

### Prisma and v1 migrations

When creating and applying migrations via v1, following Prisma's best practices and normal workflows may not be sufficient — Prisma may complain or warn about deleting all the data if proceeding with `prisma migrate dev ...` because it needs to delete and recreate certain things. In those cases using `prisma migrate diff ... ` might be helpful to bring Prisma's schema to the desired state dictated by v1 while overcoming these issues.

1. Make sure v1's migrations are applied (locally, on your machine)
2. Copy the schema file `prisma/schema.prisma` into `prisma/backupschema.prisma`
3. Run `npx prisma db pull` — this will overwrite `prisma/schema.prisma` with the changes in DB [read more...](https://www.prisma.io/docs/reference/api-reference/command-reference#db-pull)
4. Create a new directory in prisma migrations in the format `YYYYMMDDhhmmss_MIGRATION_DESCRIPTION` — for example `mkdir prisma/migrations/20230502000000_update_to_v1_schema`
5. Run `npx prisma migrate diff --from-schema-datamodel prisma/backupschema.prisma --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/20230502000000_update_to_v1_schema/migration.sql` [read more...](https://www.prisma.io/docs/reference/api-reference/command-reference#migrate-diff)
6. Finally, run `npx prisma migrate resolve --applied 20230502000000_update_to_v1_schema` [read more...](https://www.prisma.io/docs/reference/api-reference/command-reference#arguments-9)

At this point v1's changes are available in Prisma's world locally. Next, need to make sure we apply these (mark them applied) on `staging` and `production` before we push the code with the schema and migration changes we created above. This would normally first happen on `staging`, and as soon as v1's migrations are applied on `production` could be applied there too. These are the steps:
1. Get the `checksum` and the `migration_name` (we can also get this from the dir name where we created the `migration.sql` above) from the record added in the `_prisma_migrations` table for the migration we've just applied
2. Run the following query (assuming the `checksum` and `migration_name` are `1ff6881a0d1a76f446b47dafeafc1f6f8042f79f2c6dbc9f056479380fb5d44a` and `20230502000000_update_to_v1_schema` respectively):
```sql
INSERT INTO
  "public"."_prisma_migrations" (
    "id",
    "checksum",
    "finished_at",
    "migration_name",
    "started_at",
    "applied_steps_count"
  )
VALUES
  (
    gen_random_uuid(),
    '1ff6881a0d1a76f446b47dafeafc1f6f8042f79f2c6dbc9f056479380fb5d44a',
    NOW(),
    '20230502000000_update_to_v1_schema',
    NOW(),
    0
  );
```
3. At this point we can delete the backup schema file `prisma/backupschema.prisma`
4. Create and merge the PR code with the v2 schema and migrations updates — when `npm run migrate` is executed on `staging` or `production`, this migration will be skipped (already marked as applied), however since we already have the DB updates via v1 and the Prisma schema is updated (aware about the changes) the prisma client will function properly as if the migration has been executed via v2

### Managing and validating env vars
If you need to add new env vars make sure that you also update [`./src/env.mjs`](./src/env.mjs) appropriately, which validates env vars used on the server and client side.

### GH Checks
We use Typescript to make our lives easier, that's why we have TS checks and it's important the commited code has no TS errors (hint: try running `npm run build` locally to see if TS check passes.) Although sometimes may be necessary, still do your best to avoid using `@ts-ignore`, `@ts-expect-error`, `const a = b!` etc. 

We also check Prisma migrations are ok, so if anything wrong with them the check will fail (hint: try running `npx prisma migrate dev` locally to see if this check will pass.)

### S3
We use AWS S3 to upload and serve static resources, like user profile pictures, PDF Pitch decks etc. There are 3 buckets `scroobious-app-production`, `scroobious-app-staging` and `scroobious-app-development`, intended for usage on `production`, `staging` and `development` (locally) respectively. Files uploaded to these buckets are used directly in the app on the client side, so CORS needs to be properly configured for each bucket. More details about this in [`./s3`](./s3)

### Using v2 with v1

Since we'll be using v1 app at `localhost:3000` use port `3001` here. Additionally since we're using same auth cookies with NextAuth.js would need to access `v2` at a domain name different than localhost to avoid issues. 

Add the following entry in your `/etc/hosts` file:
```bash
127.0.0.1	v2.localhost
```

Start the development server:

```bash
npm run dev # let's all use npm to only have package-lock.json
```

And now `v2` can be accessed at `http://v2.localhost:3001/` without any auth cookie conflicts with v1 running at `http://localhost:3000/` at the same time

## Release to Production

To deploy (release) to production there's no need for a PR, instead we publish a new release (+tag):
- Goto https://github.com/scroobious/app-v2/releases/new
- Choose a tag (name the tag in the format of _`vYYYYMMDD.DAILY_RELEASE_ITERATION`_) where _`YYYYMMDD`_ is the current date, and _`DAILY_RELEASE_ITERATION`_ is the number of the release for the current date (usually `1`). For the title of the release use _`YYYYMMDD.DAILY_RELEASE_ITERATION`_ (same as the tag version, but without the _`v`_). For example, if we're releasing for the first time today the tag would be `v20230208.1`, and the release title would be `20230208.1`. If we need to make another release today we use `v20230208.2` and `20230208.2` for the tag and release title respectively, and so on.
- Choose `main` as target branch
- Click on the _Generate release notes_ button to get the autogenerated release description (what changed since the last release). In addition to the autogenerated description we can add extra info if needed.
- Make sure _Set as pre-release_ is unchecked, and _Set as the latest release_ is checked
- Hit the _Publish release button_

[More details on GitHub](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
