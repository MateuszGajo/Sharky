select google_id,
    facebook_id,
    twitter_id
from users
where id = $1
    and (
        google_id is not null
        or facebook_id is not null
        or twitter_id is not null
    )