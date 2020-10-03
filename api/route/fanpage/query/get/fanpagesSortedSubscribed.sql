with fanpageSubscribedIds as(
    select fanpage_id
    from fanpage_users
    where user_id = $1
),
fanpagesSorted as(
    select id
    from fanpages
    where lower(name) like($2)
        and id in(
            select *
            from fanpageSubscribedIds
        )
),
numberOfSubscribers as (
    select fanpage_id as "fanpageId",
        count(*) as "numberOfSubscribers"
    from fanpage_users
    where fanpage_id in(
            select *
            from fanpagesSorted
        )
    group by fanpage_id
)
select a.*,
    b.id as "subId",
    c.name,
    c.photo
from numberOfSubscribers as a
    left join fanpage_users as b on a."fanpageId" = b.fanpage_id
    and b.user_id = $3
    inner join fanpages as c on a."fanpageId" = c.id
order by name asc
limit 21 offset $4