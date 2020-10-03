select name,
    date,
    b."numberOfMembers"
from groups as a
    inner join(
        select group_id,
            count(*) as "numberOfMembers"
        from group_users
        where group_id = $1
        group by group_id
    ) as b on a.id = b.group_id