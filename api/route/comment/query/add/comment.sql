INSERT INTO post_comments(post_id, user_id, content, date)
values ($1, $2, $3, $4)
RETURNING id;