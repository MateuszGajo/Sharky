select email,
    phone,
    country,
    language
from users
where id = $1