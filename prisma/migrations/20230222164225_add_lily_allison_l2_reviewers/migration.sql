BEGIN;

--
-- Update Lily and Allison capabilities to `L2_REVIEWER`
--
UPDATE "public"."user"
  SET "capabilities" =  ARRAY( SELECT "type" FROM "public"."user_type" WHERE "type" = 'L2_REVIEWER' )
WHERE "email" = ANY( '{"lmacomber+reviewer@scroobious.com","abyers+reviewer@scroobious.com"}'::text[] );

--
-- Update Lily's and Allison's user roles
--
UPDATE "public"."user_role"
  SET "role_id" = ( SELECT "id" FROM "public"."role" WHERE "code" = 'l2-reviewer' )
WHERE "user_id" IN (
  SELECT "id"
  FROM "public"."user"
  WHERE "email" = ANY( '{"lmacomber+reviewer@scroobious.com","abyers+reviewer@scroobious.com"}'::text[] )
);

COMMIT;
