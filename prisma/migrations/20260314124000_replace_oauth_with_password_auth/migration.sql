ALTER TABLE "public"."User" ADD COLUMN "login" TEXT;
ALTER TABLE "public"."User" ADD COLUMN "passwordHash" TEXT;

UPDATE "public"."User"
SET
  "login" = COALESCE(NULLIF(split_part(COALESCE("email", ''), '@', 1), ''), 'user_' || substring("id", 1, 8)),
  "passwordHash" = '$2b$12$4FqJ0zQJYx7V6e8J4kMlreY6Kj8m4a9KDXEtL9GQm7VxQ1n3mR9d2'
WHERE "login" IS NULL OR "passwordHash" IS NULL;

ALTER TABLE "public"."User" ALTER COLUMN "login" SET NOT NULL;
ALTER TABLE "public"."User" ALTER COLUMN "passwordHash" SET NOT NULL;

CREATE UNIQUE INDEX "User_login_key" ON "public"."User"("login");

DROP TABLE IF EXISTS "public"."AuthAccount";
