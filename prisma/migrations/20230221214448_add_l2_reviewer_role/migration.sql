--
-- Add Nano ID for PostgreSQL https://github.com/viascom/nanoid-postgres
--
/*
 * Copyright 2022 Viascom Ltd liab. Co
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION nanoid(size int DEFAULT 21, alphabet text DEFAULT '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    RETURNS text
    LANGUAGE plpgsql
    volatile
AS
$$
DECLARE
    idBuilder     text := '';
    i             int  := 0;
    bytes         bytea;
    alphabetIndex int;
    mask          int;
    step          int;
BEGIN
    mask := (2 << cast(floor(log(length(alphabet) - 1) / log(2)) as int)) - 1;
    step := cast(ceil(1.6 * mask * size / length(alphabet)) AS int);

    while true
        loop
            bytes := gen_random_bytes(size);
            while i < size
                loop
                    alphabetIndex := (get_byte(bytes, i) & mask) + 1;
                    if alphabetIndex <= length(alphabet) then
                        idBuilder := idBuilder || substr(alphabet, alphabetIndex, 1);
                        if length(idBuilder) = size then
                            return idBuilder;
                        end if;
                    end if;
                    i = i + 1;
                end loop;

            i := 0;
        end loop;
END
$$;

--
-- Create L2 Reviewer Role if it doesn't exist already
--
INSERT INTO
  "public"."role" (
    "id",
    "created_by_id",
    "owner_id",
    "name",
    "code",
    "version"
  )
VALUES
  (
    nanoid(),
    '1',
    '1',
    'L2 Reviewer',
    'l2-reviewer',
    1
  ) ON CONFLICT DO NOTHING;

--
-- Create L2_REVIEWER User Type if it doesn't exist already
--
INSERT INTO
  "public"."user_type" (
    "id",
    "created_by_id",
    "owner_id",
    "type",
    "allowed_at_registration",
    "default_role_id",
    "version"
  )
SELECT
  nanoid(),
  '1',
  '1',
  'L2_REVIEWER',
  FALSE,
  ( SELECT "id" FROM "public"."role" WHERE "code" = 'l2-reviewer' ),
  1
WHERE NOT EXISTS (
  SELECT NULL FROM "public"."user_type" WHERE "type" = 'L2_REVIEWER' 
);

--
-- Add 'pitch_written_feedback:admin' for L2 Reviewers
--
INSERT INTO
  "public"."role_permission" (
    "id",
    "created_by_id",
    "owner_id",
    "version",
    "permission_id",
    "role_id"
  )
SELECT
    nanoid(),
    '1',
    '1',
    1,
    ( SELECT "id" FROM "public"."permission" WHERE "code" = 'pitch_written_feedback:admin' ),
    ( SELECT "id" FROM "public"."role" WHERE "code" = 'l2-reviewer' )
WHERE EXISTS (
  SELECT "id" FROM "public"."permission" WHERE "code" = 'pitch_written_feedback:admin'
)
ON CONFLICT DO NOTHING;
