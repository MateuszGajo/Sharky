with friendIds as (
    select user_id_2 as "userId"
    from friends
    where user_id_1 = $3
        and status = '1'
    union
    select user_id_1 as "userId"
    from friends
    where user_id_2 = $3
        and status = '1'
),
userSorted as (
    select id
    from users
    where(
            (
                lower(first_name) like lower($1)
                and lower(last_name) like lower($2)
            )
            or (
                lower(last_name) like lower($1)
                and lower(first_name) like lower($2)
            )
        )
        and id in (
            select *
            from friendIds
        )
),
userSortedCounted as(
    select a."userId",
        sum(a.count) as "numberOfFriends"
    from(
            select user_id_1 as "userId",
                count(user_id_1)
            from friends
            where user_id_1 in(
                    select *
                    from userSorted
                )
                and status = '1'
            group by "userId"
            union
            select user_id_2 as "userId",
                count(user_id_2)
            from friends
            where user_id_2 in(
                    select *
                    from userSorted
                )
                and status = '1'
            group by "userId"
        ) as a
    group by a."userId"
),
userRelation as (
    select user_id_1 as "userId",
        id as "friendshipId",
        status,
        date,
        CASE
            WHEN status = '0' THEN true
            else null
        end as "isInvited",
        null as "isInvitationSent"
    from friends
    where user_id_1 in (
            select *
            from userSorted
        )
        and user_id_2 = $3
    union
    select user_id_2 as "userId",
        id as "friendshipId",
        status,
        date,
        null as "isInvited",
CASE
            WHEN status = '0' THEN true
            else null
        end as "isInvitationSent"
    from friends
    where user_id_2 in (
            select *
            from userSorted
        )
        and user_id_1 = $3
)
select d.*,
    e.first_name as "firstName",
    e.last_name as "lastName",
    e.photo
from(
        select a.*,
            b.relation,
            c."numberOfFriends"
        from userRelation as a
            left join friend_relations as b on a."friendshipId" = b.friendship_id
            inner join userSortedCounted as c on a."userId" = c."userId"
        union
        select a."userId",
            null as "friendshipId",
            null as status,
            null as date,
            null as "isInvited",
            null as "isInvitationSent",
            null as relation,
            b."numberOfFriends"
        from userSortedCounted as a
            inner join userSortedCounted as b on a."userId" = b."userId"
        where a."userId" not in (
                select "userId"
                from userRelation
            )
        union
        select id as "userId",
            null as friendshipId,
            null as status,
            null as date,
            null as "isInvited",
            null as "isInvitationSent",
            null as relation,
            0 as numberOfFriends
        from userSorted
        where id not in (
                select "userId"
                from userSortedCounted
            )
    ) as d
    inner join users as e on d."userId" = e.id
order by "isInvited",
    "isInvitationSent",
    date
limit 21 offset $4