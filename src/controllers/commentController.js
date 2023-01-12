import connection from "../database/db.js";

export async function postComment(req, res) {
	const userId = res.locals.userId;
	const comment = res.locals.comment;

	try {
		await connection.query(
			"INSERT INTO comments (post_id, user_id, text) VALUES ($1, $2, $3)",
			[comment.post_id, userId, comment.text]
		);

		const query = await connection.query(
			`SELECT 
                (c.user_id=p.user_id) as "postAuthor", 
                c.text, 
                c.user_id,
                u.image,
                u.username,
                EXISTS (
                    SELECT 
                        true 
                    FROM follows 
                    WHERE follower_id=$2
                    AND followed_id=c.user_id
                ) as "following"
            FROM posts p
            JOIN comments c
            ON p.id = c.post_id
            JOIN users u
            ON u.id = c.user_id
            WHERE p.id = $1
            `,
			[comment.post_id, userId]
		);

		const comments = query.rows;

		res.status(201).send(comments);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}