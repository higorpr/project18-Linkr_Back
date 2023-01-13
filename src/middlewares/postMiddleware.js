import {
	alreadyShared,
	getAllHashtags,
	getAllPostIds,
} from "../repositories/postRepository.js";

export async function checkPostIdParameter(req, res, next) {
	const { postId } = req.params;

	if (!postId) return res.sendStatus(400);

	if (!Number(postId)) return res.sendStatus(400);

	try {
		const idsResponse = await getAllPostIds();
		const ids = idsResponse.rows.map((idRes) => idRes.id);

		if (!ids.includes(Number(postId))) {
			return res.sendStatus(404);
		}
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}

	res.locals.postId = postId;

	next();
}

export async function checkHashtag(req, res, next) {
	const { hashtag } = req.params;

	if (!hashtag) {
		return res.sendStatus(400);
	}

	try {
		const allHashtagsRes = await getAllHashtags();
		const allHashtags = allHashtagsRes.rows.map((h) => h.name);
		if (!allHashtags.includes(hashtag.toLowerCase()))
			return res.sendStatus(404);
		res.locals.hashtag = hashtag;
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}

	next();
}

export async function verifyShareUser(req, res, next) {
	const userId = res.locals.userId;
	const postId = res.locals.postId;

	try {
		const alredySharedPostRes = await alreadyShared(userId, postId);
		const alreadySharedPost = alredySharedPostRes.rows[0].alreadyShared;
		if (alreadySharedPost) {
			return res
				.status(409)
				.send("You already shared this post with the world.");
		}
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}

	next();
}
