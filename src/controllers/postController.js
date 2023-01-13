import {
	getHashtagId,
	getNumberShares,
	getPostsbyHashtagName,
	postRetweet,
	updatePost,
	updatePostHashtag,
	UsersLiked,
} from "../repositories/postRepository.js";
import {
	insertHashtags,
	searchHashtags,
} from "../repositories/publishRepository.js";
import connection from "../database/db.js";
import urlMetadata from "url-metadata";

export async function getPosts(req, res) {
	const userId = res.locals.userId;
	try {
		const query = await connection.query(
			`SELECT 
                posts.*,
                users.username as username,
                users.image as image,
                COUNT(liked_posts.user_id) as likes,
				(posts.user_id=3) as "ownPost",
                EXISTS (
                    SELECT 
                        true 
                    FROM liked_posts 
                    WHERE user_id=3 
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

		res.status(200).send(posts);
	} catch (err) {
		res.sendStatus(500);
		console.log(err);
	}
}

export async function getHashtagPosts(req, res) {
	const userId = res.locals.userId;
	const hashtagId = res.locals.hashtagId;
	const rule = `WHERE h.id=$2`;
	const arr = [userId, hashtagId];
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
				(pp.user_id=p.user_id) as shared,
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
			LEFT JOIN users u
			ON pp.user_id=u.id
			LEFT JOIN posts p
			ON pp.post_id=p.id
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
			arr
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

export async function getUsersLiked(req, res) {
	const postId = res.locals.postId;

	try {
		const usersResponse = await UsersLiked(postId);
		const users = usersResponse.rows.map((user) => user.username);
		res.status(200).send(users);
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
}

export async function updatePostText(req, res) {
	const { text } = req.body;
	const { postId } = req.params;

	try {
		await updatePost(postId, text);

		// Get hashtags
		const tags = searchHashtags(text);

		// Insert hashtags and get the ones that were inserted
		const insertedTags = await insertHashtags(tags);
		const cleanedTags = insertedTags.filter((tag) => tag !== false);

		// Insert tags into middle table (get tagId and use it)
		if (cleanedTags.length > 0) {
			for (let i = 0; i < insertedTags.length; i++) {
				const tagIdResponse = await getHashtagId(insertedTags[i]);
				const tagId = tagIdResponse.rows[0].id;
				await updatePostHashtag(postId, tagId);
			}
		}
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
	res.sendStatus(200);
}

export async function postShare(req, res) {
	const userId = res.locals.userId;
	const postId = res.locals.postId;

	try {
		await postRetweet(userId, postId);
		res.sendStatus(201);
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
}

export async function getShares(req, res) {
	const postId = res.locals.postId;

	try {
		const response = await getNumberShares(postId);
		const nShares = response.rows[0];
		return res.status(200).send(nShares);
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
}
