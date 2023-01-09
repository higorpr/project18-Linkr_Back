import {
	getHashtagId,
	hashtagPosts,
	updatePost,
	updatePostHashtag,
	UsersLiked,
} from "../repositories/postRepository.js";
import {
	insertHashtags,
	insertPostHashtag,
	searchHashtags,
} from "../repositories/publishRepository.js";

export async function getHashtagPosts(req, res) {
	const { hashtag } = req.body;

	if (!hashtag) {
		return res.sendStatus(400);
	}

	try {
		const response = await hashtagPosts(hashtag);
		console.log(response.rows);
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
	res.sendStatus(200);
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
