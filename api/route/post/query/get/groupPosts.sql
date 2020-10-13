with postIds as(
    select id as "postId"
    from posts
    where group_id = $1
),
numberOfShares as(
    select a."postId",
        count(b.id) as "numberOfShares"
    from postIds as a
        left join post_shares as b on a."postId" = b.post_id
    group by a."postId"
),
numberOfComments as(
    select a."postId",
        count(b.id) as "numberOfComments"
    from postIds as a
        left join post_comments as b on a."postId" = b.post_id
    group by a."postId"
),
numberOfLikes as(
    select a."postId",
        count(b.id) as "numberOfLikes"
    from postIds as a
        left join post_likes as b on a."postId" = b.post_id
    group by a."postId"
)
select e.*,
    f.id as "likeId"
from(
        select a.id as "postId",
            a.user_id as "userId",
            a.content,
            a.photo,
            a.date,
            b."numberOfShares",
            c."numberOfComments",
            d."numberOfLikes",
            null::integer as "shareId",
            null::integer as "postSharedUserId"
        from posts as a
            inner join numberOfShares as b on a.id = b."postId"
            inner join numberOfComments as c on a.id = c."postId"
            inner join numberOfLikes as d on a.id = d."postId"
        where id in (
                select *
                from postIds
            )
    ) as e
    left join post_likes as f on e."postId" = f.post_id
    and f.user_id = $2
order by e.date desc
limit 21 offset $3