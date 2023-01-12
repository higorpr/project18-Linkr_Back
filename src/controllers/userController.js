import connection from "../database/db.js";
import urlMetadata from "url-metadata";

export async function getUserLinks(req, res) {
	const { id } = req.params;

	try {
		const user = (
			await connection.query(
				`
            SELECT * 
            FROM users 
            WHERE id = $1;
        `,
				[id]
			)
		).rows;

		if (user.length === 0) {
			return res.status(404).send("User not found!");
		}

		const posts = (
			await connection.query(
				`
            SELECT 
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
            WHERE posts.user_id = $1 
            GROUP BY posts.id, users.username, users.image, users.id
            ORDER BY created_at DESC 
            LIMIT 20;   
        `,
				[id]
			)
		).rows;

		let i;

		for (i = 0; i < posts.length; i++) {
			await urlMetadata(posts[i].link).then(
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
		console.log(err);
		res.sendStatus(500);
	}
}

//Function used to insert an user in followers table
export async function followUser(req, res){
	const {id} = req.params;
	const {user_id} = req.body;

	const followed = (await connection.query(`
	SELECT * 
	FROM users WHERE id = $1;`,[id])).rows;
	
	//Trying to follow a ghost?
	if(followed.length === 0 ){
		return res.status(404).send("User not found!");
	}

	const following = (await connection.query(`
		SELECT * 
		FROM follows
		WHERE followed_id = $1
			AND follower_id = $2`,[id, user_id])).rows;

	//Already following an user?
	if(following.length !== 0){
		return res.status(409).send("User already followed!");
	}

	try{
		//Table insertion
		await connection.query(
			`
			INSERT 
			INTO follows 
				(followed_id, follower_id) 
			VALUES ($1, $2);
		`,
			[id, user_id]
		);

		res.sendStatus(201);
	
	} catch (err){
		console.log(err);
		res.sendStatus(500);
	}
}

//This function returns the id's of users followed by another person
export async function getUserFollows(req, res){
	const {user_id} = req.body;
	
	try{
		const following = (Object.values(await connection.query(`
			SELECT followed_id 
			FROM follows
			WHERE follower_id = $1`,[user_id])).rows);

		res.status(200).send(following);
	
	} catch (err){
		console.log(err);
		res.sendStatus(500);
	}
}

//This function deletes a row from followers table (Unfollow)
export async function unfollowUser (req, res){
	const {id} = req.params;
	const {user_id} = req.body;

	const following = (await connection.query(`
		SELECT * 
		FROM follows
		WHERE followed_id = $1
			AND follower_id = $2`,[id, user_id])).rows;

	//Not following an user?
	if(following.length === 0){
		return res.status(404).send("This user is not been followed!");
	}

	try{
		await connection.query(`
			DELETE 
			FROM follows 
			WHERE follower_id = $1
				AND
				followed_id = $2;
		`, [user_id, id]);

		res.sendStatus(200);

	} catch(err){
		console.log(err);
		res.sendStatus(500);
	}

}