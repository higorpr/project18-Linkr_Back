import connection from "../database/db.js";

export async function postComment(req, res) {
	const userId = res.locals.userId;
	const body = req.body;

	try {
		await connection.query(
			"INSERT INTO comments (post_id, user_id, text) VALUES ($1, $2, $3)",
			[body.post_id, userId, body.text]
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
			[body.post_id, userId]
		);

		const like = {
			...query.rows[0],
			selfLike: true,
		};

		res.status(201).send(like);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}