select id,
    first_name as "firstName",
    last_name as "lastName",
    photo,
    email,
    password,
    phone,
    country,
    language,
    city,
    birthDate
from users
where id = $1