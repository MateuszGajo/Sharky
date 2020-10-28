select a."groupId",
    b.id
from(
        select group_id as "groupId"
        from posts
        where id = $1
    ) as a
    left join group_users as b on a."groupId" = b.group_id
    and b.user_id = $2