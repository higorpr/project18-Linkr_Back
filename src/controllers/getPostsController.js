import connection from "../database/db.js";
import urlMetadata from "url-metadata";

export async function getPosts(req, res) {
	const userId = res.locals.userId;
	const rule = 'WHERE pp.user_id IN (SELECT followed_id  FROM follows WHERE follower_id=$1) OR pp.user_id=$1'
	const a = [userId]
	try {
		const query = await connection.query(
			`SELECT 
				p.text,
				p.id,
				pp.id as published_post_id,
				p.created_at,
				u.id as user_id,
				u.username,
				u.image,
				json_build_object('link', p.link) as metadata,
				COUNT(DISTINCT lp.user_id)::INTEGER as likes,
				COUNT(DISTINCT c.user_id)::INTEGER as commentsCount,
				(pp.user_id<>p.user_id) as shared,
				($1=p.user_id) as "ownPost",
				(SELECT 
					row_to_json(row) 
				FROM 
					(SELECT 
						u2.id, 
						u2.username, 
						u2.image 
					FROM users u2 
					WHERE p.user_id=u2.id
					)row
				) as originalUser,
				(SELECT 
					coalesce(json_agg(row), '[]'::json) 
				FROM 
					(SELECT 
						u2.id, 
						u2.username
					FROM liked_posts lp2 
					JOIN
						users u2
					ON lp2.user_id = u2.id
					WHERE lp2.post_id=p.id
					)row
				) as likedUsers,
				(SELECT 
					coalesce(json_agg(row), '[]'::json) 
				FROM 
					(SELECT 
						(p.user_id=c2.user_id) as "postAuthor", 
						c2.text, 
						c2.user_id,
						u2.image,
						u2.username,
						EXISTS (
							SELECT 
								true 
							FROM follows 
							WHERE follower_id=$1 
							AND followed_id=c2.user_id
						) as "following"
						FROM comments c2
						JOIN users u2
						ON u2.id = c2.user_id 
						WHERE p.id = c2.post_id)
					row) 
				as comments,

				EXISTS (
					SELECT 
						true 
					FROM liked_posts 
					WHERE user_id=$1 
					AND post_id=p.id
				) as "selfLike"
			FROM published_posts pp
			LEFT JOIN posts p
			ON pp.post_id=p.id
			LEFT JOIN users u
			ON p.user_id=u.id
			LEFT JOIN comments c
			ON c.post_id=p.id
			LEFT JOIN liked_posts lp
			ON lp.post_id=p.id
			LEFT JOIN posts_hashtags ph
			ON ph.post_id=pp.post_id
			LEFT JOIN hashtags h
			ON ph.hashtag_id=h.id
			${rule}
			GROUP BY  p.id, u.username, u.image, u.id, pp.id
			ORDER BY pp.created_at DESC 
			LIMIT 20;`,
			a
			);
		let i = 0;
		const posts = query.rows;

		for (i = 0; i < posts.length; i++) {
			await urlMetadata(posts[i].metadata?.link, {
				descriptionLength: 150,
				timeout: 100,
			}).then(
				function (metadata) {
					posts[i].metadata = {
						linkImage: metadata.image,
						linkTitle: metadata.title,
						linkDescription: metadata.description,
						...posts[i].metadata,
					};
				},
				function (error) {}
			);
		}

		res.status(200).send(posts);
	} catch (err) {
		res.sendStatus(500);
		console.log(err);
	}
}
