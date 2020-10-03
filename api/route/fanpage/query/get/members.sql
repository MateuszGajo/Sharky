select a.id as "subId",
    a.user_id as "userId",
    a.role,
    b.first_name as "firstName",
    b.last_name as "lastName",
    b.photo
from fanpage_users as a
    inner join users as b on b.id = a.user_id
where a.fanpage_id = $1
limit 21 offset $2