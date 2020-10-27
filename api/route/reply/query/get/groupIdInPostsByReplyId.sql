select group_id as "groupId"
from posts
where id = (
        select post_id
        from post_comments
        where id = (
                select comment_id
                from comment_replies
                where id = $1
            )
    )