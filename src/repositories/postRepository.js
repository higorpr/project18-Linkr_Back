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

export async function getHashtagId (hashtag) {
    return connection.query(`
        SELECT
            id
        FROM
            hashtags
        WHERE
            name = $1
    `,[hashtag])
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
