update posts
set content = $1
where id = $2
    and user_id = $3