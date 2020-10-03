select a.id,
    a.name,
    a.photo,
    b.id as "memberId",
    b.role
from (
        select id,
            name,
            photo
        from groups
        where id = $1
    ) as a
    left join(
        select id,
            group_id,
            role
        from group_users
        where group_id = $1
            and user_id = $2
    ) as b on a.id = b.group_id