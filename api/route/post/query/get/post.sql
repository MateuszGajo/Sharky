with numberOfLikes as(
    select post_id as "postId",
        count(id)
    from post_likes
    where post_id = $1
    group by post_id
),
numberOfComments as(
    select post_id as "postId",
        count(id)
    from post_comments
    where post_id = $1
    group by post_id
),
numberOfShares as(
    select post_id as "postId",
        count(id)
    from post_shares
    where post_id = $1
    group by post_id
)
select a.*,
    coalesce(b.count, 0) as "numberOfLikes",
    coalesce(c.count, 0) as "numberOfComments",
    coalesce(d.count, 0) as "numberOfShares",
    e.id as "likeId",
    null as "shareId",
    null::integer as "postSharedUserId"
from(
        select id as "postId",
            fanpage_id as "fanpageId",
            group_id as "groupId",
            content,
            photo,
            date,
            user_id as "userId"
        from posts
        where id = $1
    ) as a
    left join numberOfLikes as b on a."postId" = b."postId"
    left join numberOfComments as c on a."postId" = c."postId"
    left join numberOfShares as d on a."postId" = d."postId"
    left join post_likes as e on a."postId" = e.post_id
    and e.user_id = $2