select id,
    name,
    date
from user_photos
where user_id = $1
limit 7 offset $2