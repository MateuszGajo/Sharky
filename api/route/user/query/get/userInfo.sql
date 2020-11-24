with numberOfGroups as(
    select user_id as "userId",
        count(id)
    from group_users
    where user_id = $1
    group by user_id
),
numberOfFanpages as(
    select user_id as "userId",
        count(id)
    from fanpage_users
    where user_id = $1
    group by user_id
),
numberOfFriends as(
    select a."userId",
        sum(a.count)::int
    from(
            select user_id_1 as "userId",
                count(id)
            from friends
            where user_id_1 = $1
                and status = '1'
            group by user_id_1
            union
            select user_id_2 as "userId",
                count(id)
            from friends
            where user_id_2 = $1
                and status = '1'
            group by user_id_2
        ) as a
    group by a."userId"
),
numberOfPosts as(
    select user_id as "userId",
        count(id)
    from posts
    where user_id = $1
        and fanpage_id is null
        and group_id is null
    group by user_id
),
numberOfPhotos as(
    select user_id as "userId",
        count(id)
    from user_photos
    where user_id = $1
    group by user_id
),
userRelationship as(
    select a.*,
        b.relation
    from(
            select id,
                $1 as "userId",
                user_id_1 as "inviter"
            from friends
            where (
                    (
                        user_id_1 = $1
                        and user_id_2 = $2
                    )
                    or (
                        user_id_2 = $1
                        and user_id_1 = $2
                    )
                )
        ) as a
        left join friend_relations as b on a.id = b.friendship_id
)
select a.*,
    g.*,
    coalesce(b.count, 0) as "numberOfGroups",
    coalesce(c.count, 0) as "numberOfFanpages",
    coalesce(d.sum, 0) as "numberOfFriends",
    coalesce(e.count, 0) as "numberOfPosts",
    coalesce(f.count, 0) as "numberOfPhotos"
from (
        select id,
            first_name as "firstName",
            last_name as "lastName",
            photo,
            city,
            birthdate as "birthDate"
        from users
        where id = $1
    ) as a
    left join numberOfGroups as b on a.id = b."userId"
    left join numberOfFanpages as c on a.id = c."userId"
    left join numberOfFriends as d on a.id = d."userId"
    left join numberOfPosts as e on a.id = e."userId"
    left join numberOfPhotos as f on a.id = f."userId"
    left join userRelationship as g on a.id = g."userId"