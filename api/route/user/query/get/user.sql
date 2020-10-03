select id,
    first_name as "firstName",
    last_name as "lastName",
    photo
from users
where id = any($1);