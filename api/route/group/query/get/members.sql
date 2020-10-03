select b.first_name as "firstName",
    b.last_name as "lastName",
    b.id as "userId",
    b.photo,
    a.role,
    a.id "subId"
from group_users as a
    inner join users as b on b.id = a.user_id
where a.group_id = $1