with userIds as(
    SELECT $1 AS "userId"
    union
    select user_id_1 as "userId"
    from friends
    where user_id_2 = $1
        and user_id_1 not in (
            select user_id_2
            from user_mutes
            where user_id_1 = $1
        )
        and status = '1'
    union
    select user_id_2 as "userId"
    from friends
    where user_id_1 = $1
        and user_id_2 not in (
            select user_id_2
            from user_mutes
            where user_id_1 = $1
        )
        and status = '1'
),
postIds as(
    select id as "postId"
    from posts
    where user_id in(
            select *
            from userIds
        )
        and group_id is null
        and fanpage_id is null
),
postSharedIds as (
    select post_id as "postId"
    from post_shares
    where user_id in(
            select *
            from userIds
        )
),
postAndPostSharedIds as(
    select *
    from postIds
    union
    select *
    from postSharedIds
),
numberOfShares as(
    select a."postId",
        count(b.id) as "numberOfShares"
    from postAndPostSharedIds as a
        left join post_shares as b on a."postId" = b.post_id
    group by a."postId"
),
numberOfComments as(
    select a."postId",
        count(b.id) as "numberOfComments"
    from postAndPostSharedIds as a
        left join post_comments as b on a."postId" = b.post_id
    group by a."postId"
),
numberOfLikes as(
    select a."postId",
        count(b.id) as "numberOfLikes"
    from postAndPostSharedIds as a
        left join post_likes as b on a."postId" = b.post_id
    group by a."postId"
),
shareIDs as (
    select id as "postId"
    from post_shares
    where user_id in(
            select *
            from userIds
        )
),
postsShared as (
    select a.post_id as "postId",
        c."numberOfShares",
        d."numberOfComments",
        e."numberOfLikes",
        b.user_id as "userId",
        b.content,
        b.photo,
        a.date,
        a.id::text as "shareId",
        a.user_id::text as "postSharedUserId"
    from post_shares as a
        inner join posts as b on a.post_id = b.id
        inner join numberOfShares as c on a.post_id = c."postId"
        inner join numberOfComments as d on a.post_id = d."postId"
        inner join numberOfLikes as e on a.post_id = e."postId"
    where a.id in (
            select *
            from shareIDs
        )
),
posts as (
    select a.id as "postId",
        b."numberOfShares",
        c."numberOfComments",
        d."numberOfLikes",
        a.user_id as "userId",
        a.content,
        a.photo,
        a.date,
        null as "shareId",
        null as "postSharedUserId"
    from posts as a
        inner join numberOfShares as b on a.id = b."postId"
        inner join numberOfComments as c on a.id = c."postId"
        inner join numberOfLikes as d on a.id = d."postId"
    where id in(
            select *
            from postIds
        )
)
select a.*,
    b.id as "likeId"
from(
        select *
        from postsShared
        union all
        select *
        from posts
    ) as a
    left join post_likes as b on a."postId" = b.post_id
    and b.user_id = $1
order by date desc
limit 21 offset $2