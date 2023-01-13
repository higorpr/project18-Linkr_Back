import connection from "../database/db.js";
import urlMetadata from "url-metadata";

let lastPost = null;
let lastPostId = 0;
export async function getPosts(req, res) {
	const userId = res.locals.userId;
	try {
		const query = await connection.query(
			`SELECT 
                posts.*,
                users.username as username,
                users.image as image,
                COUNT(liked_posts.user_id) as likes,
				($1=posts.user_id) as "ownPost",
                EXISTS (
                    SELECT 
                        true 
                    FROM liked_posts 
                    WHERE user_id=$1 
                    AND post_id=posts.id
                ) as "selfLike"
            FROM posts 
            LEFT JOIN users
            ON users.id=posts.user_id
            LEFT JOIN liked_posts
            ON posts.id=liked_posts.post_id
            GROUP BY posts.id, users.username, users.image, users.id
            ORDER BY created_at DESC 
            LIMIT 20;`,
			[userId]
		);
		let i = 0;
		const posts = query.rows;

		for (i = 0; i < posts.length; i++) {
			await urlMetadata(posts[i].link, {
				descriptionLength: 150,
				timeout: 100,
			}).then(
				function (metadata) {
					posts[i] = {
						linkImage: metadata.image,
						linkTitle: metadata.title,
						linkDescription: metadata.description,
						...posts[i],
					};
				},
				function (error) {}
			);
		}
		
		// get the first post rendered as last post and get the id of the lastPost
		lastPost = posts[0];
		lastPostId = lastPost.id;
		
		return res.send(lastPostId, posts)
	} catch (err) {
		res.sendStatus(500);
		console.log(err);
	}
}

export async function timelineUpdate(req, res) {
	const userId = res.locals.userId;
	let count = 0;
    if(!lastPostId) {
		console.log("erro no if")
		return res.send("erro no if")
	}

	try {
		const query = await connection.query(`
		SELECT 
		posts.*, 
		users.username as username, 
		users.image as image, 
		COUNT(liked_posts.user_id) as likes, 
		($1=posts.user_id) as "ownPost", 
		EXISTS ( SELECT true FROM liked_posts 
			WHERE user_id=$1 
			AND post_id=posts.id ) as "selfLike" 
			FROM posts 
			LEFT JOIN users 
			ON users.id=posts.user_id 
			LEFT JOIN liked_posts 
			ON posts.id=liked_posts.post_id 
			WHERE posts.id > $2 
			GROUP BY posts.id, users.username, users.image, users.id 
			ORDER BY created_at 
			DESC;`, 
			[userId, lastPostId]);
	
		let i = 0;
		const posts = query.rows;
		count = posts.length;
	
		for (i = 0; i < posts.length; i++) {
			await urlMetadata(posts[i].link, {
				descriptionLength: 150,
				timeout: 100,
			}).then(
				function (metadata) {
					posts[i] = {
						linkImage: metadata.image,
						linkTitle: metadata.title,
						linkDescription: metadata.description,
						...posts[i],
					};
				},
				function (error) {}
			);
		}

		return res.json({count, posts})
	} catch (err) {
		res.sendStatus(500);
		console.log(err);
	}
}
