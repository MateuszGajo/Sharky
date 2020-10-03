insert into reply_likes(reply_id, user_id)
select $1,
    $2
where not exists (
        select id
        from reply_likes
        where reply_id = $1
            and user_id = $2
    )
returning id