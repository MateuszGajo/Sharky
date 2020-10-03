select id,
    email,
    password,
    first_name as "firstName",
    last_name as "lastName",
    phone,
    country,
    language,
    photo,
    birthdate as "birthDate",
    city
from users
where email = $1