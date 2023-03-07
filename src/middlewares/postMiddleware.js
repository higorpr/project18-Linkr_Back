import {
	alreadyShared,
	getAllHashtags,
	getAllPostIds,
	getHashtagId,
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
	const { hashtag } = req.query;

	if (!hashtag) {
		return res.sendStatus(400);
	}

	try {
		const hashtagIdRes = await getHashtagId(hashtag);
		if (hashtagIdRes.rows.lenght === 0) {
			return res.sendStatus(404);
		}
		const hashtagId = hashtagIdRes.rows[0].id;
		res.locals.hashtagId = hashtagId;
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
