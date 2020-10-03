select *
from fanpage_users
where fanpage_id = $1
    and role = 'admin'