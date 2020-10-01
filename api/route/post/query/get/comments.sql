with commentsIds as(
    select id as "commnetId",
        post_id as "postId"
    from post_comments
    where post_id = any($1)
),
numberOfLikes as (
    select a."commnetId",
        count(b.id) as "numberOfLikes"
    from commentsIds as a
        left join comment_likes as b on a."commnetId" = b.comment_id
    group by a."commnetId"
),
numberOfReplies as (
    select a."commnetId",
        a."postId",
        count(b.id) as "numberOfReplies"
    from commentsIds as a
        left join comment_replies as b on a."commnetId" = b.comment_id
    group by a."commnetId",
        a."postId"
),
likedComment as(
    select id as "likeId",
        comment_id as "commnetId"
    from comment_likes
    where comment_id in (
            select "commnetId"
            from commentsIds
        )
        and user_id = $2
)
select e.*
from(
        select a.id as "commnetId",
            a.post_id as "postId",
            a.user_id as "userId",
            a.content,
            a.date,
            b."numberOfLikes",
            c."numberOfReplies",
            d."likeId"
        from post_comments as a
            inner join numberOfLikes as b on a.id = b."commnetId"
            inner join numberOfReplies as c on a.id = c."commnetId"
            left join likedComment as d on a.id = d."commnetId"
        where id in(
                select "commnetId"
                from commentsIds
            )
    ) as e
order by date desc
limit 3 offset 0