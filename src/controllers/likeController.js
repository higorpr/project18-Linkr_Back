import connection from "../database/db.js";

export async function postLike(req, res) {
	const userId = res.locals.userId;
	const postId = req.params.id;

	try {
		await connection.query(
			"INSERT INTO liked_posts (post_id, user_id) VALUES ($1, $2)",
			[postId, userId]
		);

		const query = await connection.query(
			`SELECT
                COUNT(user_id) as likes
            FROM liked_posts
            WHERE post_id = $1
            `,
			[postId]
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
