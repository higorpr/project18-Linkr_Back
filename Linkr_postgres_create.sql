CREATE TABLE "users" (
	"id" serial NOT NULL,
	"username" TEXT NOT NULL,
	"email" TEXT NOT NULL UNIQUE,
	"password" TEXT NOT NULL,
	"image" TEXT NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
);

CREATE TABLE "sessions" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL UNIQUE,
	"token" TEXT NOT NULL UNIQUE,
	CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
);

CREATE TABLE "hashtags" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL,
	CONSTRAINT "hashtags_pk" PRIMARY KEY ("id")
);

CREATE TABLE "posts_hashtags" (
	"id" serial NOT NULL,
	"post_id" integer NOT NULL,
	"hashtag_id" integer NOT NULL,
	CONSTRAINT "posts_hashtags_pk" PRIMARY KEY ("id")
);

CREATE TABLE "posts" (
	"id" serial NOT NULL,
	"text" TEXT NOT NULL,
	"user_id" integer NOT NULL,
	"link" TEXT NOT NULL,
	"created_at" TIMESTAMP NOT NULL,
	CONSTRAINT "posts_pk" PRIMARY KEY ("id")
);

CREATE TABLE "liked_posts" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"post_id" integer NOT NULL,
	CONSTRAINT "liked_posts_pk" PRIMARY KEY ("id")
);

ALTER TABLE
	"sessions"
ADD
	CONSTRAINT "sessions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE
	"posts_hashtags"
ADD
	CONSTRAINT "posts_hashtags_fk0" FOREIGN KEY ("post_id") REFERENCES "posts"("id");

ALTER TABLE
	"posts_hashtags"
ADD
	CONSTRAINT "posts_hashtags_fk1" FOREIGN KEY ("hashtag_id") REFERENCES "hashtags"("id");

ALTER TABLE
	"posts"
ADD
	CONSTRAINT "posts_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE
	"liked_posts"
ADD
	CONSTRAINT "liked_posts_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE
	"liked_posts"
ADD
	CONSTRAINT "liked_posts_fk1" FOREIGN KEY ("post_id") REFERENCES "posts"("id");