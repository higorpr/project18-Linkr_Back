import connection from "../database/db.js";

export async function likeAlreadyExists(req, res, next) {
	const userId = res.locals.userId;
	const postId = req.params.id;

	try {
		const query = await connection.query(
			"SELECT * FROM liked_posts WHERE post_id=$1 AND user_id=$2",
			[postId, userId]
		);

		const like = query.rows;

		if (like.length) {
			res.sendStatus(409);
		} else {
			next();
		}
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}
