INSERT INTO users(
        email,
        password,
        first_name,
        last_name,
        phone,
        photo,
        country,
        language
    )
values($1, $2, $3, $4, $5, 'profile.png', $6, $7)
returning id