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
		const query = await mainPost(rule, arr);

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
