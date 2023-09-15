-- CreateTable
CREATE TABLE "accreditation_status" (
    "id" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,

    CONSTRAINT "pk accreditation_status id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_account" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "user_id" VARCHAR NOT NULL,
    "provider_type" VARCHAR NOT NULL,
    "provider_id" VARCHAR NOT NULL,
    "provider_account_id" VARCHAR NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "access_token_expires" TIMESTAMPTZ(6),
    "compound_id" VARCHAR NOT NULL,

    CONSTRAINT "pk auth_account id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendly_webhook_event" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'NEW',
    "type" VARCHAR NOT NULL,
    "raw" JSONB NOT NULL,

    CONSTRAINT "pk calendly_webhook_event id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkout_request" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "stripe_plan_id" VARCHAR NOT NULL,

    CONSTRAINT "pk checkout_request id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkout_response" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "stripe_session_id" VARCHAR NOT NULL,

    CONSTRAINT "pk checkout_response id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "city" (
    "id" VARCHAR NOT NULL,
    "lat" DOUBLE PRECISION,
    "lon" DOUBLE PRECISION,
    "population" INTEGER,
    "state_province_id" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,

    CONSTRAINT "pk city id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_role" (
    "id" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,

    CONSTRAINT "pk company_role id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_stage" (
    "id" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,

    CONSTRAINT "pk company_stage id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "friendly_name" VARCHAR,

    CONSTRAINT "pk conversation id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_message" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "conversation_id" VARCHAR NOT NULL,
    "body" VARCHAR(1600) NOT NULL,
    "read_at" TIMESTAMPTZ(6),

    CONSTRAINT "pk conversation_message id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_participant" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "conversation_id" VARCHAR NOT NULL,
    "user_id" VARCHAR NOT NULL,
    "last_read_at" TIMESTAMPTZ(6),

    CONSTRAINT "pk conversation_participant id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corporate_structure" (
    "id" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,

    CONSTRAINT "pk corporate_structure id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "country" (
    "id" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,

    CONSTRAINT "pk country id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'ACTIVE',
    "current_step" VARCHAR NOT NULL,
    "course_definition_id" VARCHAR NOT NULL,
    "pitch_id" VARCHAR NOT NULL,

    CONSTRAINT "pk course id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_definition" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,

    CONSTRAINT "pk course_definition id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_definition_product" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "course_definition_id" VARCHAR NOT NULL,
    "product_id" VARCHAR NOT NULL,

    CONSTRAINT "pk course_definition_product id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_product" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "course_id" VARCHAR NOT NULL,
    "product_id" VARCHAR NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'AVAILABLE',
    "object_id" VARCHAR,

    CONSTRAINT "pk course_product id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_step" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "course_id" VARCHAR NOT NULL,
    "data" JSONB NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'COMPLETE',
    "course_step_definition_id" VARCHAR NOT NULL,

    CONSTRAINT "pk course_step id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_step_definition" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "section" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "type" VARCHAR NOT NULL,
    "sequence_num" INTEGER NOT NULL,
    "config" JSONB NOT NULL,
    "course_definition_id" VARCHAR NOT NULL,
    "event_type" VARCHAR,

    CONSTRAINT "pk course_step_definition id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "criteria" (
    "id" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,

    CONSTRAINT "pk criteria id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disability" (
    "id" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,

    CONSTRAINT "pk disability id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ethnicity" (
    "id" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,

    CONSTRAINT "pk ethnicity id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" VARCHAR NOT NULL,
    "type" VARCHAR NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'NEW',
    "object_type" VARCHAR NOT NULL,
    "object_id" VARCHAR NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "payload" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "status_message" VARCHAR,

    CONSTRAINT "pk event id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_type" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "template" VARCHAR,
    "allow_subscription" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "pk event_type id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_system_id" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "external_system_id" VARCHAR NOT NULL,
    "external_system_name" VARCHAR NOT NULL,
    "user_id" VARCHAR,

    CONSTRAINT "pk external_system_id id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "url" VARCHAR NOT NULL,

    CONSTRAINT "pk file id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_upload" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "file_path" VARCHAR NOT NULL,

    CONSTRAINT "pk file_upload id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "founder_profile" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "user_id" VARCHAR NOT NULL,
    "state_province" VARCHAR NOT NULL,
    "twitter_url" VARCHAR,
    "linkedin_url" VARCHAR,
    "ethnicities" VARCHAR[],
    "gender" VARCHAR,
    "sexual_orientation" VARCHAR,
    "transgender" VARCHAR,
    "disability" VARCHAR,
    "working_status" VARCHAR,
    "source" VARCHAR,
    "pronouns" VARCHAR,
    "bubble_location" VARCHAR,
    "company_stage" VARCHAR,
    "funding_status" VARCHAR,
    "industry" VARCHAR[],
    "presentation_status" VARCHAR,
    "company_roles" VARCHAR[],

    CONSTRAINT "pk founder_profile id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funding_status" (
    "id" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,

    CONSTRAINT "pk funding_status id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gender" (
    "id" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,

    CONSTRAINT "pk gender id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "industry" (
    "id" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,

    CONSTRAINT "pk industry id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_profile" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "accreditation_statuses" VARCHAR[],
    "linkedin_url" VARCHAR,
    "investor_types" VARCHAR[],
    "thesis" TEXT,
    "criteria" VARCHAR[],
    "industries" VARCHAR[],
    "demographics" VARCHAR[],
    "state_province" VARCHAR,
    "user_id" VARCHAR NOT NULL,
    "company_stages" VARCHAR[],
    "funding_statuses" VARCHAR[],
    "revenues" VARCHAR[],
    "source" VARCHAR,
    "ethnicities" VARCHAR[],
    "gender" VARCHAR,
    "pronouns" VARCHAR,

    CONSTRAINT "pk investor_profile id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_type" (
    "id" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,

    CONSTRAINT "pk investor_type id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "migrations" (
    "id" SERIAL NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "pk migrations id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "user_id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "website" VARCHAR NOT NULL,

    CONSTRAINT "pk organization id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "token" VARCHAR NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'OPEN',

    CONSTRAINT "pk password_reset id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perk" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "company_name" VARCHAR NOT NULL,
    "company_bio" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "perk_category_id" VARCHAR NOT NULL,
    "url" VARCHAR NOT NULL,
    "logo_file_id" VARCHAR NOT NULL,

    CONSTRAINT "pk perk id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perk_category" (
    "id" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,

    CONSTRAINT "pk perk_category id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "description" VARCHAR(100),

    CONSTRAINT "pk permission id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pitch" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "user_id" VARCHAR NOT NULL,
    "organization_id" VARCHAR NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "bookmarks" INTEGER NOT NULL DEFAULT 0,
    "challenges" VARCHAR,
    "status" VARCHAR NOT NULL DEFAULT 'DRAFT',
    "deck_comfort_level" INTEGER,
    "presentation_comfort_level" INTEGER,
    "presentation_status" VARCHAR,
    "short_description" VARCHAR,
    "female" BOOLEAN NOT NULL DEFAULT false,
    "minority" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "pk pitch id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pitch_comment" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "body" VARCHAR NOT NULL,
    "pitch_id" VARCHAR NOT NULL,
    "visibility" VARCHAR NOT NULL,

    CONSTRAINT "pk pitch_comment id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pitch_deck" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "pitch_id" VARCHAR NOT NULL,
    "file_id" VARCHAR NOT NULL,
    "status" VARCHAR NOT NULL,
    "draft" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "pk pitch_deck id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pitch_meeting_feedback" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "pitch_id" VARCHAR NOT NULL,
    "recording_file_id" VARCHAR,
    "reviewer_notes" VARCHAR,
    "status" VARCHAR NOT NULL DEFAULT 'REQUESTED',
    "reviewer_id" VARCHAR,
    "course_product_id" VARCHAR NOT NULL,

    CONSTRAINT "pk pitch_meeting_feedback id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pitch_update" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "body" VARCHAR NOT NULL,
    "pitch_id" VARCHAR NOT NULL,

    CONSTRAINT "pk pitch_update id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pitch_user_status" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "user_id" VARCHAR NOT NULL,
    "pitch_id" VARCHAR NOT NULL,
    "watch_status" VARCHAR NOT NULL DEFAULT 'UNWATCHED',
    "list_status" VARCHAR NOT NULL DEFAULT 'DEFAULT',

    CONSTRAINT "pk pitch_user_status id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pitch_video" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "status" VARCHAR NOT NULL,
    "pitch_id" VARCHAR NOT NULL,
    "video_id" VARCHAR NOT NULL,

    CONSTRAINT "pk pitch_video id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pitch_written_feedback" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "pitch_id" VARCHAR NOT NULL,
    "reviewer_notes" VARCHAR,
    "status" VARCHAR NOT NULL DEFAULT 'REQUESTED',
    "reviewer_id" VARCHAR,
    "course_product_id" VARCHAR NOT NULL,
    "original_pitch_deck_id" VARCHAR,
    "reviewed_pitch_deck_id" VARCHAR,

    CONSTRAINT "pk pitch_written_feedback id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "stripe_plan_id" VARCHAR NOT NULL,
    "stripe_plan_name" VARCHAR NOT NULL,
    "stripe_plan_description" VARCHAR NOT NULL,
    "stripe_plan_currency" VARCHAR NOT NULL,
    "stripe_plan_price" DOUBLE PRECISION NOT NULL,
    "stripe_plan_period" VARCHAR NOT NULL,
    "user_id" VARCHAR NOT NULL,
    "stripe_plan_subscription_id" VARCHAR NOT NULL,
    "status" VARCHAR,

    CONSTRAINT "pk plan id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presentation_status" (
    "id" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,

    CONSTRAINT "pk presentation_status id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,

    CONSTRAINT "pk product id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pronoun" (
    "id" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,

    CONSTRAINT "pk pronoun id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revenue" (
    "id" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,

    CONSTRAINT "pk revenue id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "code" VARCHAR(50) NOT NULL,

    CONSTRAINT "pk role id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permission" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "permission_id" VARCHAR NOT NULL,
    "role_id" VARCHAR NOT NULL,

    CONSTRAINT "pk role_permission id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "user_id" VARCHAR NOT NULL,
    "expires" TIMESTAMPTZ(6) NOT NULL,
    "session_token" VARCHAR NOT NULL,
    "access_token" VARCHAR NOT NULL,

    CONSTRAINT "pk session id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sexual_orientation" (
    "id" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,

    CONSTRAINT "pk sexual_orientation id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "startup" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "name" VARCHAR,
    "website" VARCHAR,
    "corporate_structure" VARCHAR,
    "state_province" VARCHAR,
    "fundraise_status" VARCHAR,
    "company_stage" VARCHAR,
    "revenue" VARCHAR,
    "short_description" VARCHAR,
    "organization_id" VARCHAR NOT NULL,
    "industries" VARCHAR[] DEFAULT ARRAY[]::VARCHAR[],
    "origin_story" VARCHAR,
    "additional_team_members" BOOLEAN,
    "business_challenge" VARCHAR,
    "presentation_status" VARCHAR,
    "desired_support" VARCHAR,
    "anything_else" VARCHAR,
    "country" VARCHAR,
    "deck_comfort_level" INTEGER,
    "presentation_comfort_level" INTEGER,
    "user_id" VARCHAR NOT NULL,

    CONSTRAINT "pk startup id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "state_province" (
    "id" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,

    CONSTRAINT "pk state_province id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stripe_webhook_event" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "type" VARCHAR NOT NULL,
    "raw" JSONB NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'NEW',

    CONSTRAINT "pk stripe_webhook_event id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "event_type_id" VARCHAR NOT NULL,
    "type" VARCHAR NOT NULL,
    "url" VARCHAR,
    "job_id" VARCHAR,
    "active" BOOLEAN DEFAULT true,

    CONSTRAINT "pk subscription id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suggested_resource" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "company_name" VARCHAR NOT NULL,
    "suggested_resource_category_id" VARCHAR NOT NULL,
    "url" VARCHAR NOT NULL,
    "logo_file_id" VARCHAR NOT NULL,

    CONSTRAINT "pk suggested_resource id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suggested_resource_category" (
    "id" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,

    CONSTRAINT "pk suggested_resource_category id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transgender" (
    "id" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,

    CONSTRAINT "pk transgender id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "email_verified" TIMESTAMPTZ(6),
    "password" VARCHAR,
    "status" VARCHAR NOT NULL DEFAULT 'INACTIVE',
    "capabilities" VARCHAR[],
    "last_login_at" TIMESTAMPTZ(6),
    "migrated_from_bubble" BOOLEAN DEFAULT false,
    "is_accredited" BOOLEAN DEFAULT false,
    "first_name" VARCHAR,
    "profile_picture_file_id" VARCHAR NOT NULL,
    "stripe_user_id" VARCHAR,

    CONSTRAINT "pk user id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_activity" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "event_type" VARCHAR NOT NULL,

    CONSTRAINT "pk user_activity id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_invite" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "user_type" VARCHAR NOT NULL,
    "expires_at" TIMESTAMPTZ(6),
    "status" VARCHAR NOT NULL DEFAULT 'OPEN',

    CONSTRAINT "pk user_invite id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_plan_registration" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "full_name" VARCHAR NOT NULL,
    "stripe_subscription_id" VARCHAR NOT NULL,
    "stripe_plan_id" VARCHAR NOT NULL,
    "raw" JSONB NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'INPROGRESS',
    "user_id" VARCHAR NOT NULL,
    "user_type" VARCHAR NOT NULL,

    CONSTRAINT "pk user_plan_registration id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "user_id" VARCHAR NOT NULL,
    "role_id" VARCHAR NOT NULL,
    "organization" VARCHAR,

    CONSTRAINT "pk user_role id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_type" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "type" VARCHAR NOT NULL,
    "default_role_id" VARCHAR NOT NULL,
    "allowed_at_registration" BOOLEAN NOT NULL,

    CONSTRAINT "pk user_type id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_request" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "identifier" VARCHAR NOT NULL,
    "token" VARCHAR NOT NULL,
    "expires" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk verification_request id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video" (
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,
    "deleted_at" VARCHAR,
    "deleted_by_id" VARCHAR,
    "version" INTEGER NOT NULL,
    "owner_id" VARCHAR NOT NULL,
    "file_id" VARCHAR NOT NULL,
    "wistia_id" VARCHAR NOT NULL,

    CONSTRAINT "pk video id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "working_status" (
    "id" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by_id" VARCHAR,

    CONSTRAINT "pk working_status id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bubble_allison_suggested_resource" (
    "category" TEXT,
    "name" TEXT,
    "url" TEXT
);

-- CreateTable
CREATE TABLE "bubble_company" (
    "co.hq location" TEXT,
    "company name" TEXT,
    "companystage" TEXT,
    "country of incorporation" TEXT,
    "deck comfort lvl" TEXT,
    "description" TEXT,
    "elevator pitch" TEXT,
    "employee_id" TEXT,
    "fundraisestatus" TEXT,
    "industry" TEXT,
    "origin story" TEXT,
    "pitch deck" TEXT,
    "pitch_id" TEXT,
    "presentation comfort lvl" TEXT,
    "presented" TEXT,
    "revenue" TEXT,
    "teamMembers" TEXT,
    "u.s.corporatestructure" TEXT,
    "user_id" TEXT,
    "website" TEXT,
    "Creation Date" TEXT,
    "Modified Date" TEXT,
    "Slug" TEXT,
    "Creator" TEXT,
    "unique id" TEXT,
    "clean_company_state" VARCHAR,
    "clean_company_stage" VARCHAR,
    "clean_country" VARCHAR,
    "clean_funding_status" VARCHAR,
    "clean_presented" VARCHAR,
    "clean_revenue" VARCHAR,
    "clean_corporate_structure" VARCHAR,
    "clean_industries" VARCHAR[],
    "clean_team_members" BOOLEAN
);

-- CreateTable
CREATE TABLE "bubble_company_pitch" (
    "company_id" TEXT,
    "pitch challenges" TEXT,
    "Creation Date" TEXT,
    "Modified Date" TEXT,
    "Slug" TEXT,
    "Creator" TEXT,
    "unique id" TEXT
);

-- CreateTable
CREATE TABLE "bubble_employee" (
    "companyRole" TEXT,
    "user_id" TEXT,
    "workingStatus" TEXT,
    "Creation Date" TEXT,
    "Modified Date" TEXT,
    "Slug" TEXT,
    "Creator" TEXT,
    "unique id" TEXT,
    "clean_company_roles" VARCHAR[],
    "clean_working_status" VARCHAR,
    "valid_record" BOOLEAN
);

-- CreateTable
CREATE TABLE "bubble_founder_video_id" (
    "user_id" TEXT,
    "video_id" TEXT,
    "Creation Date" TEXT,
    "Modified Date" TEXT,
    "Slug" TEXT,
    "Creator" TEXT,
    "unique id" TEXT
);

-- CreateTable
CREATE TABLE "bubble_module_1" (
    "checkbox req1" TEXT,
    "checkbox req2" TEXT,
    "checkbox req3" TEXT,
    "checkbox req4" TEXT,
    "checkbox req5" TEXT,
    "extra pitch review" TEXT,
    "feedback 1" TEXT,
    "feedback 2" TEXT,
    "first_name" TEXT,
    "pitch review " TEXT,
    "progress" TEXT,
    "user_id" TEXT,
    "Creation Date" TEXT,
    "Modified Date" TEXT,
    "Slug" TEXT,
    "Creator" TEXT,
    "unique id" TEXT
);

-- CreateTable
CREATE TABLE "bubble_module_2" (
    "checkbox req1" TEXT,
    "checkbox req2" TEXT,
    "extra pitch review" TEXT,
    "feedback 1" TEXT,
    "feedback 2" TEXT,
    "first_name" TEXT,
    "pitch review" TEXT,
    "progress" TEXT,
    "user_id" TEXT,
    "Creation Date" TEXT,
    "Modified Date" TEXT,
    "Slug" TEXT,
    "Creator" TEXT,
    "unique id" TEXT
);

-- CreateTable
CREATE TABLE "bubble_module_3" (
    "checkbox req1" TEXT,
    "checkbox req2" TEXT,
    "extra pitch review" TEXT,
    "feedback 1" TEXT,
    "feedback 2" TEXT,
    "first_name" TEXT,
    "pitch review" TEXT,
    "progress" TEXT,
    "user_id" TEXT,
    "Creation Date" TEXT,
    "Modified Date" TEXT,
    "Slug" TEXT,
    "Creator" TEXT,
    "unique id" TEXT
);

-- CreateTable
CREATE TABLE "bubble_module_4" (
    "checkbox req1" TEXT,
    "checkbox req2" TEXT,
    "checkbox req3" TEXT,
    "extra pitch review" TEXT,
    "feedback 1" TEXT,
    "feedback 2" TEXT,
    "first_name" TEXT,
    "pitch review" TEXT,
    "progress" TEXT,
    "user_id" TEXT,
    "Creation Date" TEXT,
    "Modified Date" TEXT,
    "Slug" TEXT,
    "Creator" TEXT,
    "unique id" TEXT
);

-- CreateTable
CREATE TABLE "bubble_module_5" (
    "checkbox req1" TEXT,
    "checkbox req2" TEXT,
    "checkbox req3" TEXT,
    "checkbox req4" TEXT,
    "checkbox req5" TEXT,
    "extra pitch review" TEXT,
    "feedback 1" TEXT,
    "feedback 2" TEXT,
    "first_name" TEXT,
    "pitch review " TEXT,
    "progress" TEXT,
    "user_id" TEXT,
    "Creation Date" TEXT,
    "Modified Date" TEXT,
    "Slug" TEXT,
    "Creator" TEXT,
    "unique id" TEXT
);

-- CreateTable
CREATE TABLE "bubble_perk" (
    "company description" TEXT,
    "company logo" TEXT,
    "company name" TEXT,
    "headline" TEXT,
    "website url" TEXT,
    "Creation Date" TEXT,
    "Modified Date" TEXT,
    "Slug" TEXT,
    "Creator" TEXT,
    "unique id" TEXT
);

-- CreateTable
CREATE TABLE "bubble_reviews_completed" (
    "unique id" TEXT,
    "email" TEXT,
    "written_1" BOOLEAN,
    "written_2" BOOLEAN,
    "video_1" BOOLEAN,
    "video_extra" BOOLEAN,
    "progress" INTEGER
);

-- CreateTable
CREATE TABLE "bubble_user" (
    "anything else" TEXT,
    "Business challenge" TEXT,
    "company_id" TEXT,
    "completed on-boarding" TEXT,
    "disability" TEXT,
    "employee_id" TEXT,
    "ethnicity" TEXT,
    "first_name" TEXT,
    "founder_partner_id" TEXT,
    "gender" TEXT,
    "investor_about_Scroobious" TEXT,
    "investor_anything_else" TEXT,
    "investor_mem_id" TEXT,
    "investor_quests_id" TEXT,
    "last login" TEXT,
    "last_name" TEXT,
    "linkedin link" TEXT,
    "location" TEXT,
    "mod_1_id" TEXT,
    "mod_2_id" TEXT,
    "mod_3_id" TEXT,
    "mod_4_id" TEXT,
    "mod_5_id" TEXT,
    "newsletter" TEXT,
    "orientation" TEXT,
    "partner_org_id" TEXT,
    "source" TEXT,
    "support" TEXT,
    "transgender" TEXT,
    "twitter link" TEXT,
    "User type" TEXT,
    "visited page before" TEXT,
    "wistia_video_id" TEXT,
    "Creation Date" TEXT,
    "Modified Date" TEXT,
    "Slug" TEXT,
    "email" TEXT,
    "null" TEXT,
    "unique id" TEXT,
    "migrate_record" VARCHAR,
    "clean_ethnicity" VARCHAR,
    "clean_disability" VARCHAR,
    "clean_gender" VARCHAR,
    "clean_sexual_orientation" VARCHAR,
    "clean_transgender" VARCHAR
);

-- CreateIndex
CREATE UNIQUE INDEX "uq auth_account compound_id" ON "auth_account"("compound_id");

-- CreateIndex
CREATE INDEX "idx auth_account provider_account_id" ON "auth_account"("provider_account_id");

-- CreateIndex
CREATE INDEX "idx auth_account provider_id" ON "auth_account"("provider_id");

-- CreateIndex
CREATE INDEX "idx auth_account user_id" ON "auth_account"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq course pitch_id" ON "course"("pitch_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq event_type name" ON "event_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "uq founder_profile user_id" ON "founder_profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq investor_profile user_id" ON "investor_profile"("user_id");

-- CreateIndex
CREATE INDEX "idx organization user_id" ON "organization"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq password_reset token" ON "password_reset"("token");

-- CreateIndex
CREATE UNIQUE INDEX "uq perk logo_file_id" ON "perk"("logo_file_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq permission code" ON "permission"("code");

-- CreateIndex
CREATE UNIQUE INDEX "rc pitch_deck file_id" ON "pitch_deck"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq pitch_meeting_feedback recording_file_id" ON "pitch_meeting_feedback"("recording_file_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq pitch_user_status pitch_id+user_id" ON "pitch_user_status"("user_id", "pitch_id");

-- CreateIndex
CREATE UNIQUE INDEX "rc pitch_video video_id" ON "pitch_video"("video_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq pitch_written_feedback original_pitch_deck_id" ON "pitch_written_feedback"("original_pitch_deck_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq pitch_written_feedback reviewed_pitch_deck_id" ON "pitch_written_feedback"("reviewed_pitch_deck_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq role code" ON "role"("code");

-- CreateIndex
CREATE UNIQUE INDEX "uq role_permission permission_id+role_id" ON "role_permission"("role_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq session session_token" ON "session"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "uq session access_token" ON "session"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "rc startup organization_id" ON "startup"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "rc suggested_resource logo_file_id" ON "suggested_resource"("logo_file_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq user email" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "uq user profile_picture_file_id" ON "user"("profile_picture_file_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq user_role role_id+user_id" ON "user_role"("user_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq verification_request token" ON "verification_request"("token");

-- CreateIndex
CREATE UNIQUE INDEX "uq video file_id" ON "video"("file_id");

-- AddForeignKey
ALTER TABLE "auth_account" ADD CONSTRAINT "fk auth_account user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "city" ADD CONSTRAINT "fk city state_province_id" FOREIGN KEY ("state_province_id") REFERENCES "state_province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "conversation_message" ADD CONSTRAINT "fk conversation_message conversation_id" FOREIGN KEY ("conversation_id") REFERENCES "conversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "conversation_message" ADD CONSTRAINT "fk conversation_message created_by_id" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "conversation_participant" ADD CONSTRAINT "fk conversation_participant conversation_id" FOREIGN KEY ("conversation_id") REFERENCES "conversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "conversation_participant" ADD CONSTRAINT "fk conversation_participant user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "fk course course_definition_id" FOREIGN KEY ("course_definition_id") REFERENCES "course_definition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "fk course pitch_id" FOREIGN KEY ("pitch_id") REFERENCES "pitch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_definition_product" ADD CONSTRAINT "fk course_definition_product course_definition_id" FOREIGN KEY ("course_definition_id") REFERENCES "course_definition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_definition_product" ADD CONSTRAINT "fk course_definition_product product_id" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_product" ADD CONSTRAINT "fk course_product course_id" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_product" ADD CONSTRAINT "fk course_product product_id" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_step" ADD CONSTRAINT "fk course_step course_id" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_step" ADD CONSTRAINT "fk course_step course_step_definition_id" FOREIGN KEY ("course_step_definition_id") REFERENCES "course_step_definition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_step" ADD CONSTRAINT "fk course_step created_by_id" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_step_definition" ADD CONSTRAINT "fk course_step_definition course_definition_id" FOREIGN KEY ("course_definition_id") REFERENCES "course_definition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "external_system_id" ADD CONSTRAINT "fk external_system_id user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investor_profile" ADD CONSTRAINT "fk investor_profile user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organization" ADD CONSTRAINT "fk organization user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "perk" ADD CONSTRAINT "fk perk logo_file_id" FOREIGN KEY ("logo_file_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "perk" ADD CONSTRAINT "fk perk perk_category_id" FOREIGN KEY ("perk_category_id") REFERENCES "perk_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pitch" ADD CONSTRAINT "fk pitch created_by_id" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pitch" ADD CONSTRAINT "fk pitch organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pitch" ADD CONSTRAINT "fk pitch updated_by_id" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pitch" ADD CONSTRAINT "fk pitch user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pitch_comment" ADD CONSTRAINT "fk pitch_comment created_by_id" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pitch_comment" ADD CONSTRAINT "fk pitch_comment pitch_id" FOREIGN KEY ("pitch_id") REFERENCES "pitch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pitch_deck" ADD CONSTRAINT "fk pitch_deck file_id" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pitch_deck" ADD CONSTRAINT "fk pitch_deck pitch_id" FOREIGN KEY ("pitch_id") REFERENCES "pitch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pitch_meeting_feedback" ADD CONSTRAINT "fk pitch_meeting_feedback course_product_id" FOREIGN KEY ("course_product_id") REFERENCES "course_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pitch_meeting_feedback" ADD CONSTRAINT "fk pitch_meeting_feedback pitch_id" FOREIGN KEY ("pitch_id") REFERENCES "pitch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pitch_meeting_feedback" ADD CONSTRAINT "fk pitch_meeting_feedback recording_file_id" FOREIGN KEY ("recording_file_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pitch_meeting_feedback" ADD CONSTRAINT "fk pitch_meeting_feedback reviewer_id" FOREIGN KEY ("reviewer_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pitch_update" ADD CONSTRAINT "fk pitch_update created_by_id" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pitch_update" ADD CONSTRAINT "fk pitch_update pitch_id" FOREIGN KEY ("pitch_id") REFERENCES "pitch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pitch_user_status" ADD CONSTRAINT "fk pitch_user_status pitch_id" FOREIGN KEY ("pitch_id") REFERENCES "pitch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pitch_user_status" ADD CONSTRAINT "fk pitch_user_status user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pitch_video" ADD CONSTRAINT "fk pitch_video pitch_id" FOREIGN KEY ("pitch_id") REFERENCES "pitch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pitch_video" ADD CONSTRAINT "fk pitch_video video_id" FOREIGN KEY ("video_id") REFERENCES "video"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pitch_written_feedback" ADD CONSTRAINT "fk pitch_written_feedback course_product_id" FOREIGN KEY ("course_product_id") REFERENCES "course_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pitch_written_feedback" ADD CONSTRAINT "fk pitch_written_feedback original_pitch_deck_id" FOREIGN KEY ("original_pitch_deck_id") REFERENCES "pitch_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pitch_written_feedback" ADD CONSTRAINT "fk pitch_written_feedback pitch_id" FOREIGN KEY ("pitch_id") REFERENCES "pitch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pitch_written_feedback" ADD CONSTRAINT "fk pitch_written_feedback reviewed_pitch_deck_id" FOREIGN KEY ("reviewed_pitch_deck_id") REFERENCES "pitch_deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pitch_written_feedback" ADD CONSTRAINT "fk pitch_written_feedback reviewer_id" FOREIGN KEY ("reviewer_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "plan" ADD CONSTRAINT "fk plan user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "fk role_permission permission_id" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "fk role_permission role_id" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "startup" ADD CONSTRAINT "fk startup organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "suggested_resource" ADD CONSTRAINT "fk suggested_resource logo_file_id" FOREIGN KEY ("logo_file_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "suggested_resource" ADD CONSTRAINT "fk suggested_resource suggested_resource_category_id" FOREIGN KEY ("suggested_resource_category_id") REFERENCES "suggested_resource_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "fk user profile_picture_file_id" FOREIGN KEY ("profile_picture_file_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_activity" ADD CONSTRAINT "fk user_activity created_by_id" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_plan_registration" ADD CONSTRAINT "fk user_plan_registration user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "fk user_role role_id" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_type" ADD CONSTRAINT "fk user_type default_role_id" FOREIGN KEY ("default_role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "video" ADD CONSTRAINT "fk video file_id" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

