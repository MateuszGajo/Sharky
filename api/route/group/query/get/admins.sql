select *
select user_id as "userId"
from group_users
where group_id = $1
    and role = 'admin'