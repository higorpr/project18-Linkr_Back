import connection from "../database/db.js";

export async function hashtagPosts(hashtag) {
	return connection.query(
		`
        SELECT 
            p.*
        FROM
            posts p
        JOIN
            posts_hastag p_h
        ON 
            p.id = p_h.post_id
        JOIN
            hashtags h
        ON
            p_h.hashtag_id = h.id
        WHERE
            h.name = $1
        LIMIT
            20
    `,
		[hashtag]
	);
}

export async function getAllPostIds() {
	return connection.query(`
        SELECT
            id
        FROM
            posts;
    `);
}

export async function UsersLiked(postId) {
	return connection.query(
		`
        SELECT 
            u.username
        FROM
            posts p
        JOIN
            liked_posts l
        ON p.id = l.post_id
        JOIN
            users u
        ON l.user_id = u.id
        WHERE
            p.id = $1
    `,
		[postId]
	);
}

export async function updatePost(postId, text) {
	return connection.query(
		`
        UPDATE
            posts
        SET
           text = $1
        WHERE
            id = $2
    `,
		[text, postId]
	);
}

export async function getHashtagId(hashtag) {
	return connection.query(
		`
        SELECT
            id
        FROM
            hashtags
        WHERE
            name = $1
    `,
		[hashtag]
	);
}

export async function updatePostHashtag(postId, hashtagId) {
	return connection.query(
		`
        INSERT INTO
            posts_hashtags (post_id, hashtag_id)
        VALUES
            ($1,$2)     
    `,
		[postId, hashtagId]
	);
}

export async function getAllHashtags() {
	return connection.query(`
        SELECT
            name
        FROM
            hashtags;
    `);
}

export async function getPostsbyHashtagName(userId, hashtag) {
	return connection.query(
		`
    SELECT
        p.*,
        u.username AS username,
        u.image AS image,
        COUNT(lp.user_id) AS likes,
        ($1=p.user_id) as "ownPost",
        EXISTS (
            SELECT
                true
            FROM
                liked_posts lp
            WHERE
                user_id = $1 AND post_id = p.id
        ) AS "selfLike"
    FROM
        posts p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN liked_posts lp ON p.id = lp.post_id
    LEFT JOIN posts_hashtags ph ON p.id = ph.post_id
    LEFT JOIN hashtags h ON ph.hashtag_id = h.id
    WHERE
        h.name = LOWER($2)
    GROUP BY
        p.id,
        u.username,
        u.image, 
        u.id
    ORDER BY
        p.created_at DESC
    LIMIT
        20;

    `,
		[userId, hashtag]
	);
}

export async function postRetweet(userId, postId) {
	return connection.query(
		`
        INSERT INTO
            published_posts (post_id, user_id)
        VALUES
            ($1, $2)
    `,
		[postId, userId]
	);
}

export async function selfShare(userId, postId) {
	return connection.query(
		`
        SELECT
        EXISTS(
            SELECT
                *
            FROM
                published_posts pp
            JOIN
                posts p
            ON p.user_id = pp.user_id
            WHERE
                p.user_id = $1 AND pp.post_id = $2
        ) AS "selfShare";
    `,
		[userId, postId]
	);
}

export async function alreadyShared(userId, postId) {
	return connection.query(
		`
        SELECT
        EXISTS (
            SELECT
                *
            FROM
                published_posts pp
            WHERE
                pp.user_id = $1 AND pp.post_id = $2
        ) as "alreadyShared"
    `,
		[userId, postId]
	);
}

export async function getNumberShares(postId) {
	return connection.query(
		`
        SELECT
	        COALESCE(
		        (
			        SELECT
				        COUNT(pp.user_id)
			        FROM
				        published_posts pp
				        JOIN posts p ON pp.post_id = p.id
			        WHERE
				        pp.post_id = $1
				        AND pp.user_id <> p.user_id
			        GROUP BY
				        pp.post_id
		        ),0
	        )::INTEGER AS "numberOfShares";
    `,
		[postId]
	);
}
