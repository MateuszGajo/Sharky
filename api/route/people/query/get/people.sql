with usersSorted as (
    select id
    from users
    where (
            lower(first_name) like lower($1)
            and lower(last_name) like lower($2)
        )
        or (
            lower(last_name) like lower($1)
            and lower(first_name) like lower($2)
        )
),
usersSortedCounted as(
    with a as(
        select user_id_1 as "userId",
            count(user_id_1)
        from friends
        where user_id_1 in(
                select *
                from usersSorted
            )
            and status = '1'
        group by "userId"
        union all
        select user_id_2 as "userId",
            count(user_id_2)
        from friends
        where user_id_2 in(
                select *
                from usersSorted
            )
            and status = '1'
        group by "userId"
    )
    select b.id as "userId",
        coalesce(sum(a.count)::int, 0) as "numberOfFriends"
    from(
            select *
            from usersSorted
        ) as b
        left join a on a."userId" = b.id
    group by b.id
),
usersInvited as (
    select user_id as "userId",
        id::text as "subId",
        status::text,
        CASE
            WHEN status = '0' THEN true
            else null
        end as "isInvitationSent"
    from group_users
    where user_id in (
            select *
            from usersSorted
        )
        and group_id = $3
),
usersNotInvited as(
    select id as "userId",
        null as "subId",
        null as status,
        null::boolean as "isInvitationSent"
    from usersSorted
    where id not in (
            select "userId"
            from usersInvited
        )
),
usersStatus as (
    select *
    from usersInvited
    where status != '1'
    union
    select *
    from usersNotInvited
)
select a.*,
    b."numberOfFriends",
    c.first_name as "firstName",
    c.last_name as "lastName",
    c.photo
from usersStatus as a
    inner join usersSortedCounted as b on a."userId" = b."userId"
    inner join users as c on a."userId" = c.id
order by c.first_name desc
limit 21 offset $4