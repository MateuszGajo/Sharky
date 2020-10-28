select a.*,
    b.first_name as "firstName",
    b.last_name as "lastName",
    b.photo
from (
        select role,
            id "subId",
            user_id as "userId"
        from group_users
        where group_id = $1
            and status = '1'
    ) as a
    inner join users as b on a."userId" = b.id