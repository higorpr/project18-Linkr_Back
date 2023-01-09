SELECT
    p.*,
    u.username AS username,
    u.image AS image,
    COUNT(lp.user_id) AS likes,
    EXISTS (
        SELECT
            true
        FROM
            liked_posts lp
        WHERE
            user_id = 30
            AND post_id = p.id
    ) AS "selfLike"
FROM
    posts p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN liked_posts lp ON p.id = lp.post_id
    LEFT JOIN posts_hashtags ph ON p.id = ph.post_id
    LEFT JOIN hashtags h ON ph.hashtag_id = h.id
WHERE
    h.name = 'fut'
GROUP BY
    p.id,
    u.username,
    u.image
ORDER BY
    p.created_at DESC
LIMIT
    20;