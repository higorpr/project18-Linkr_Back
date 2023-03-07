import connection from "../database/db.js";

export async function searchUser(token) {
	const result = (
		await connection.query(
			`
            SELECT u.* 
            FROM users u JOIN sessions s 
            ON u.id = s.user_id 
            WHERE s.token = $1`,
			[token]
		)
	).rows;

	if (result.length === 0) {
		return false;
	} else {
		return result[0];
	}
}

export async function searchLink(link) {
	const result = (
		await connection.query(
			`
            SELECT * 
            FROM posts 
            WHERE link = $1`,
			[link]
		)
	).rows[0];

	if (!result) {
		return false;
	} else {
		return result;
	}
}

export function searchHashtags(text) {
	//Here I'll find the tags inside de message

	const words = text.split(" ");

	const regex = new RegExp("^[#*]");
	const tags = words
		.filter((e) => (regex.test(e) ? e : ""))
		.map((e) => e.replace("#", "").toLowerCase());

	return tags;
}

async function searchTrend(e) {
	const trend = (
		await connection.query(
			`
        SELECT id 
        FROM hashtags 
        WHERE name = $1;
    `,
			[e]
		)
	).rows;

	if (trend.length === 0) {
		return false;
	} else {
		return trend[0];
	}
}

export async function insertHashtags(arr) {
	const inTags = [];
	if (arr.length === 0) {
		return;
	}

	for (let i = 0; i < arr.length; i++) {
		const hashtag = await searchTrend(arr[i]);
		if (!hashtag) {
			await connection.query(
				`
                INSERT 
                INTO hashtags (name) 
                VALUES ($1);
            `,
				[arr[i]]
			);
			inTags.push(arr[i]);
		}
	}
	return inTags;
}

export async function insertPost(text, link, id) {
	const postId = (
		await connection.query(
			`
        INSERT 
        INTO posts 
            (text, link, user_id) 
        VALUES ($1, $2, $3)
		RETURNING id
    `,
			[text, link, id]
		)
	).rows[0].id;
	return postId;
}

export async function insertPublishedPost(id, postId) {
	const publishedPostId = (
		await connection.query(
			`
        INSERT 
        INTO published_posts 
            (user_id, post_id) 
        VALUES ($1, $2)
		RETURNING id
    `,
			[id, postId]
		)
	).rows[0];
	return publishedPostId;
}

export async function insertPostHashtag(hashtags, postId) {
	if (hashtags.length === 0) {
		return;
	}

	for (let i = 0; i < hashtags.length; i++) {
		const hashtag = await searchTrend(hashtags[i]);
		await connection.query(
			`
            INSERT
            INTO posts_hashtags 
                (post_id, hashtag_id)
            VALUES ($1, $2);
        `,
			[postId, hashtag.id]
		);
	}
}

export async function deleteFromPost(id) {
	const post = await connection.query(
		`
		DELETE 
		FROM posts
		WHERE id = ($1)
		;`,
		[id]
	);
}

export async function deleteFromPostHashtag(id) {
	const post_hashtag = await connection.query(
		`
		DELETE 
		FROM posts_hashtags 
		WHERE post_id 
			IN ($1)
		RETURNING *;`,
		[id]
	);
}

export async function deleteFromPostLikes(id) {
	const post_hashtag = await connection.query(
		`
		DELETE 
		FROM liked_posts 
		WHERE post_id 
			IN ($1)
		RETURNING *;`,
		[id]
	);
}

export async function deleteFromPublishedPosts(id) {
	const post_hashtag = await connection.query(
		`
		DELETE 
		FROM published_posts 
		WHERE post_id 
			IN ($1)
		RETURNING *;`,
		[id]
	);
}

export async function deleteFromPostsComments(id) {
	const post_hashtag = await connection.query(
		`
		DELETE 
		FROM comments 
		WHERE post_id 
			IN ($1)
		RETURNING *;`,
		[id]
	);
}
