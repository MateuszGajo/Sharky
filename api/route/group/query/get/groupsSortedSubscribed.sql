with groupSubscribedIds as(
    select group_id
    from group_users
    where user_id = $1
),
groupSorted as(
    select id
    from groups
    where lower(name) like($2)
        and id in(
            select *
            from groupSubscribedIds
        )
),
numberOfMembers as (
    select group_id as "groupId",
        count(*) as "numberOfMembers"
    from group_users
    where group_id in(
            select *
            from groupSorted
        )
        and status = '1'
    group by group_id
)
select a.*,
    b.id as "subId",
    c.name,
    c.photo
from numberOfMembers as a
    left join group_users as b on a."groupId" = b.group_id
    and b.user_id = $3
    inner join groups as c on a."groupId" = c.id
order by name asc
limit 21 offset $4