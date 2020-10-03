select a.*,
    b.name,
    b.photo
from(
        select id as "subscribeId",
            group_id as "groupId",
            date
        from group_users
        where user_id = $1
            and status = '0'
    ) as a
    inner join groups as b on a."groupId" = b.id