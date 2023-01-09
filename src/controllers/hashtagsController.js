import connection from "../database/db.js";

export async function getTrending10Hashtags(req, res){
    try{
        const query = await connection.query(`
            SELECT
                hashtags.id,
                hashtags.name,
                COUNT(posts_hashtags.hashtag_id) as "postsCount"
            FROM hashtags
            LEFT JOIN posts_hashtags
            ON hashtags.id=posts_hashtags.hashtag_id
            GROUP BY hashtags.id
            ORDER BY "postsCount" DESC
            LIMIT 10;
        `);
        res.status(200).send(query.rows);
    }catch(err){
        res.sendStatus(500);
        console.log(err);
    }
}