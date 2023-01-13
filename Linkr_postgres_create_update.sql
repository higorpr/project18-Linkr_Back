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



CREATE TABLE "comments" (
	"id" serial NOT NULL,
	"text" TEXT NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT 'NOW()',
	CONSTRAINT "comments_pk" PRIMARY KEY ("id")
);



CREATE TABLE "posts_comments" (
	"id" serial NOT NULL,
	"post_id" integer NOT NULL,
	"comment_id" integer NOT NULL,
	CONSTRAINT "posts_comments_pk" PRIMARY KEY ("id")
);



CREATE TABLE "follows" (
	"id" serial NOT NULL,
	"follower_id" integer NOT NULL,
	"followed_id" integer NOT NULL,
	CONSTRAINT "follows_pk" PRIMARY KEY ("id")
);



CREATE TABLE "published_posts" (
	"id" serial NOT NULL,
	"post_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
	CONSTRAINT "shared_posts_pk" PRIMARY KEY ("id")
);


ALTER TABLE "comments" ADD CONSTRAINT "comments_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "posts_comments" ADD CONSTRAINT "posts_comments_fk0" FOREIGN KEY ("post_id") REFERENCES "posts"("id");
ALTER TABLE "posts_comments" ADD CONSTRAINT "posts_comments_fk1" FOREIGN KEY ("comment_id") REFERENCES "comments"("id");

ALTER TABLE "follows" ADD CONSTRAINT "follows_fk0" FOREIGN KEY ("follower_id") REFERENCES "users"("id");
ALTER TABLE "follows" ADD CONSTRAINT "follows_fk1" FOREIGN KEY ("followed_id") REFERENCES "users"("id");

ALTER TABLE "shared_posts" ADD CONSTRAINT "shared_posts_fk0" FOREIGN KEY ("post_id") REFERENCES "posts"("id");
ALTER TABLE "shared_posts" ADD CONSTRAINT "shared_posts_fk1" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "posts_hashtags" ADD CONSTRAINT "posts_hashtags_fk0" FOREIGN KEY ("post_id") REFERENCES "posts"("id");
ALTER TABLE "posts_hashtags" ADD CONSTRAINT "posts_hashtags_fk1" FOREIGN KEY ("hashtag_id") REFERENCES "hashtags"("id");

ALTER TABLE "posts" ADD CONSTRAINT "posts_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "liked_posts" ADD CONSTRAINT "liked_posts_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "liked_posts" ADD CONSTRAINT "liked_posts_fk1" FOREIGN KEY ("post_id") REFERENCES "posts"("id");

ALTER TABLE "comments" ADD CONSTRAINT "comments_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "posts_comments" ADD CONSTRAINT "posts_comments_fk0" FOREIGN KEY ("post_id") REFERENCES "posts"("id");
ALTER TABLE "posts_comments" ADD CONSTRAINT "posts_comments_fk1" FOREIGN KEY ("comment_id") REFERENCES "comments"("id");

ALTER TABLE "follows" ADD CONSTRAINT "follows_fk0" FOREIGN KEY ("follower_id") REFERENCES "users"("id");
ALTER TABLE "follows" ADD CONSTRAINT "follows_fk1" FOREIGN KEY ("followed_id") REFERENCES "users"("id");

ALTER TABLE "published_posts" ADD CONSTRAINT "published_posts_fk0" FOREIGN KEY ("post_id") REFERENCES "posts"("id");
ALTER TABLE "published_posts" ADD CONSTRAINT "published_posts_fk1" FOREIGN KEY ("user_id") REFERENCES "users"("id");



