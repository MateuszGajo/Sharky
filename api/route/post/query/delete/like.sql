delete from post_likes
where post_id = $1
    and user_id = $2