with fanpageSorted as(
    select id
    from fanpages
    where lower(name) like($1)
),
fanpagesSubscribed as (
    select fanpage_id as "fanpageId",
        count(*) as "numberOfSubscribes"
    from fanpage_users
    where fanpage_id in(
            select *
            from fanpageSorted
        )
    group by fanpage_id
),
fanpagesUnsubscribed as(
    select id,
        0 as "numberOfSubscribes"
    from fanpageSorted
    where id not in (
            select "fanpageId"
            from fanpagesSubscribed
        )
),
fanpagesCounted as(
    select *
    from fanpagesSubscribed
    union
    select *
    from fanpagesUnsubscribed
)
select a.*,
    b.id as "subId",
    c.name,
    c.photo
from fanpagesCounted as a
    left join fanpage_users as b on a."fanpageId" = b.fanpage_id
    and b.user_id = $2
    inner join fanpages as c on a."fanpageId" = c.id
order by "subId"
limit 21 offset $3;