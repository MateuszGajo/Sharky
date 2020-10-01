with friendIds as(
    select user_id_1 as "userId"
    from friends
    where CASE
            when $4 then user_id_2 = $1
            and status = '1'
            else user_id_2 = $1
        end
    union
    select user_id_2 as "userId"
    from friends
    where CASE
            when $4 then user_id_1 = $1
            and status = '1'
            else user_id_1 = $1
        end
),
friendsCounted as(
    select a."userId",
        sum(a.count) as "numberOfFriends"
    from(
            select user_id_1 as "userId",
                count(user_id_1)
            from friends
            where user_id_1 in(
                    select *
                    from friendIds
                )
                and status = '1'
            group by user_id_1
            union
            select user_id_2 as "userId",
                count(user_id_2)
            from friends
            where user_id_2 in(
                    select *
                    from friendIds
                )
                and status = '1'
            group by user_id_2
        ) as a
    group by a."userId"
),
friendsStatus as(
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
    where user_id_1 in(
            select *
            from friendIds
        )
        and user_id_2 = $2
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
    where user_id_2 in(
            select *
            from friendIds
        )
        and user_id_1 = $2
)
select d.*,
    e.first_name as "firstName",
    e.last_name as "lastName",
    e.photo
from(
        select a.*,
            coalesce(b."numberOfFriends", 0) as "numberOfFriends",
            c.relation
        from friendsStatus as a
            left join friendsCounted as b on a."userId" = b."userId"
            left join friend_relations as c on a."friendshipId" = c.friendship_id
        union
        select a."userId",
            null as friendshipId,
            null as status,
            null as date,
            null as "isInvited",
            null as "isInvitationSent",
            a."numberOfFriends",
            null as relation
        from friendsCounted as a
        where a."userId" not in (
                select "userId"
                from friendsStatus
            )
    ) as d
    inner join users as e on d."userId" = e.id
order by "isInvited",
    "isInvitationSent",
    date
limit 21 offset $3