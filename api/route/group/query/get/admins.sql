select *
from group_users
where group_id = $1
    and role = 'admin'