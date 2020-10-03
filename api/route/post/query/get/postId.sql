select id
from post_likes
where user_id = $1
    and post_id = $2