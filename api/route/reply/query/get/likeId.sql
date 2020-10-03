select id
from reply_likes
where reply_id = $1
    and user_id = $2