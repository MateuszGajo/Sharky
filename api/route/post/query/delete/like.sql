delete from post_likes
where id = $1
    and user_id = $2