# Migration `20200601195016`

This migration has been generated by enricoschaaf at 6/1/2020, 7:50:16 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Polls" (
"allowMultipleOptions" boolean  NOT NULL ,"id" text  NOT NULL ,"slug" text  NOT NULL ,"title" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Options" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" text  NOT NULL ,"key" integer  NOT NULL DEFAULT 0,"name" text  NOT NULL ,"pollId" text  NOT NULL ,"votes" integer  NOT NULL DEFAULT 0,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Ips" (
"id" text  NOT NULL ,"ip" text  NOT NULL ,"pollId" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE UNIQUE INDEX "Polls.slug" ON "public"."Polls"("slug")

CREATE  INDEX "Polls.slug" ON "public"."Polls"("slug")

CREATE  INDEX "Ips.ip" ON "public"."Ips"("ip")

ALTER TABLE "public"."Options" ADD FOREIGN KEY ("pollId")REFERENCES "public"."Polls"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Ips" ADD FOREIGN KEY ("pollId")REFERENCES "public"."Polls"("id") ON DELETE CASCADE  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200601195016
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,39 @@
+datasource db {
+  provider = "postgresql"
+  url      = env("DATABASE_URL")
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+model Poll {
+  id                   String   @default(cuid()) @id
+  slug                 String   @unique
+  title                String
+  options              Option[]
+  allowMultipleOptions Boolean
+  Blacklist            Ip[]
+  @@index([slug])
+  @@map("Polls")
+}
+
+model Option {
+  id        String   @default(cuid()) @id
+  key       Int      @default(0)
+  name      String
+  createdAt DateTime @default(now())
+  votes     Int      @default(0)
+  Poll      Poll     @relation(fields: [pollId], references: [id])
+  pollId    String
+  @@map("Options")
+}
+
+model Ip {
+  id     String @default(cuid()) @id
+  ip     String
+  Poll   Poll   @relation(fields: [pollId], references: [id])
+  pollId String
+  @@index([ip])
+  @@map("Ips")
+}
```

