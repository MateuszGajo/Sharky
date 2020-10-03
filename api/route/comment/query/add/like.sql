insert into comment_likes(comment_id, user_id)
select $1,
    $2
where not exists(
        select id
        from comment_likes
        where comment_id = $1
            and user_id = $2
    )
returning id