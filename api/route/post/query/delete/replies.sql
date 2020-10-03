delete from comment_replies
where comment_id in(
        select id
        from post_comments
        where post_id = $1
    )