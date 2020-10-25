with replyId as (
    select id
    from reply_likes
    where reply_id = $1
        and user_id = $2
),
addLike as (
    insert into reply_likes(reply_id, user_id)
    select $1,
        $2
    where not exists (
            select id
            from replyId
        )
    returning id
)
select id
from addLike
union all
select id
from replyId