INSERT INTO comment_replies(comment_id, user_id, content, date)
values($1, $2, $3, $4)
returning id