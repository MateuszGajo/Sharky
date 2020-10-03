select id
from fanpage_users
where fanpage_id = $1
    and user_id = $2