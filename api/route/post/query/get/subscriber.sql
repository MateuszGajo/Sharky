select id
from fanpage_users
where user_id = $1
    and fanpage_id = $2