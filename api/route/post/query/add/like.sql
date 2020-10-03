INSERT INTO post_likes(user_id, post_id)
select $1,
    $2
where not exists (
        select id
        from post_likes
        where user_id = $1
            and post_id = $2
    )
returning id