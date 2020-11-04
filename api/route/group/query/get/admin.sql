select id
from group_users
where user_id = $1
    and group_id = $2
    and role = 'admin'