with friendIds as(
    select user_id_1 as "userId"
    from friends
    where user_id_2 = $1
        and status = '1'
    union
    select user_id_2 as "userId"
    from friends
    where user_id_1 = $1
        and status = '1'
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
            group by user_id_1
            union
            select user_id_2 as "userId",
                count(user_id_2)
            from friends
            where user_id_2 in(
                    select *
                    from friendIds
                )
            group by user_id_2
        ) as a
    group by a."userId"
),
friendsInvited as (
    select user_id as "userId",
        id::text as "subId",
        status::text,
        CASE
            WHEN status = '0' THEN true::text
            else null
        end as "isInvitationSent"
    from group_users
    where user_id in (
            select *
            from friendIds
        )
        and group_id = $2
),
friendsNotInvited as(
    select *,
        null as "subId",
        null as status,
        null as "isInvitationSent"
    from friendIds
    where "userId" not in (
            select "userId"
            from friendsInvited
        )
),
friendsStatus as (
    select *
    from friendsInvited
    where status != '1'
    union
    select *
    from friendsNotInvited
)
select a.*,
    b."numberOfFriends",
    c.first_name as "firstName",
    c.last_name as "lastName",
    c.photo
from friendsStatus as a
    inner join friendsCounted as b on a."userId" = b."userId"
    inner join users as c on a."userId" = c.id
order by c.first_name asc
limit 21 offset $3