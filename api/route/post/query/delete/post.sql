delete from posts
where id = $1
    and user_id = $2
returning id