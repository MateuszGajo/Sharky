select a.*,
    b.id as "subId",
    b.role
from(
        select id
        from fanpages
        where id = $1
    ) as a
    left join fanpage_users as b on a.id = b.fanpage_id
    and b.user_id = $2