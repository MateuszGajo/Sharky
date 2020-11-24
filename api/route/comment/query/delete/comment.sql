delete from post_comments
where id = $1
    and user_id = $2