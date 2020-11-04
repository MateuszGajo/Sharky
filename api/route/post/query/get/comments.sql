with commentsIds as(
    select id as "commentId",
        post_id as "postId"
    from post_comments
    where post_id = any($1)
),
numberOfLikes as (
    select a."commentId",
        count(b.id) as "numberOfLikes"
    from commentsIds as a
        left join comment_likes as b on a."commentId" = b.comment_id
    group by a."commentId"
),
numberOfReplies as (
    select a."commentId",
        a."postId",
        count(b.id) as "numberOfReplies"
    from commentsIds as a
        left join comment_replies as b on a."commentId" = b.comment_id
    group by a."commentId",
        a."postId"
),
likedComment as(
    select id as "likeId",
        comment_id as "commentId"
    from comment_likes
    where comment_id in (
            select "commentId"
            from commentsIds
        )
        and user_id = $2
)
select e.*
from(
        select a.id as "commentId",
            a.post_id as "postId",
            a.user_id as "userId",
            a.content,
            a.date,
            b."numberOfLikes",
            c."numberOfReplies",
            d."likeId"
        from post_comments as a
            inner join numberOfLikes as b on a.id = b."commentId"
            inner join numberOfReplies as c on a.id = c."commentId"
            left join likedComment as d on a.id = d."commentId"
        where id in(
                select "commentId"
                from commentsIds
            )
    ) as e
order by date desc
limit 3 offset 0