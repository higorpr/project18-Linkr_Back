import connection from "../database/db.js";

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
        h.name = $2
    GROUP BY
        p.id,
        u.username,
        u.image
    ORDER BY
        p.created_at DESC
    LIMIT
        20;

    `,
		[userId, hashtag]
	);
}
