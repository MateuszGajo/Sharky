with fanpageIds as(
    select b.fanpage_id
    from(
            select a.fanpage_id
            from fanpage_users as a
            where user_id = $1
        ) as b
        left join(
            select a.fanpage_id
            from fanpage_users as a
            where user_id = $2
        ) as c on c.fanpage_id = b.fanpage_id
    where c.fanpage_id is null
)
select a."subId",
    a."fanpageId",
    a."numberOfSubscribes",
    b.name,
    b.description,
    b.photo
from(
        select id as "subId",
            user_id,
            fanpage_id as "fanpageId",
            count(*) over (partition by fanpage_id) as "numberOfSubscribes"
        from fanpage_users
        where fanpage_id in(
                select a.fanpage_id
                from fanpage_users as a
                where user_id = $1
            )
    ) as a
    left join fanpages as b on a."fanpageId" = b.id
where a.user_id = $2
union
select null as "subId",
    b.*,
    fanpages.name,
    fanpages.description,
    fanpages.photo
from(
        select a.id as "fanpageId",
            count(*) as "numberOfSubscribes"
        from(
                select fanpages.id
                from fanpages
                    left join fanpage_users on fanpages.id = fanpage_users.fanpage_id
                where fanpages.id in(
                        select *
                        from fanpageIds
                    )
            ) as a
        group by a.id
    ) as b
    inner join fanpages on b."fanpageId" = fanpages.id
limit 21 offset $3