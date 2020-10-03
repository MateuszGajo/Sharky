with groupSorted as(
    select id
    from groups
    where lower(name) like($1)
),
groupsSubscribed as (
    select group_id as "groupId",
        count(*) as "numberOfMembers"
    from group_users
    where group_id in(
            select *
            from groupSorted
        )
    group by group_id
),
groupsUnsubscribed as(
    select id,
        0 as "numberOfMembers"
    from groupSorted
    where id not in (
            select "groupId"
            from groupsSubscribed
        )
),
groupsCounted as(
    select *
    from groupsSubscribed
    union
    select *
    from groupsUnsubscribed
)
select a.*,
    b.id as "subId",
    c.name,
    c.photo
from groupsCounted as a
    left join group_users as b on a."groupId" = b.group_id
    and b.user_id = $2
    inner join groups as c on a."groupId" = c.id
order by "subId"
limit 21 offset $3