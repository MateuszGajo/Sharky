select a.*,
    a."fanpageId",
    b.name,
    b.date
from(
        select fanpage_id as "fanpageId",
            count(*) as "numberOfSubscribers"
        from fanpage_users
        where fanpage_id = $1
        group by "fanpageId"
    ) as a
    inner join fanpages as b on a."fanpageId" = b.id