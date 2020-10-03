INSERT INTO users(
        email,
        password,
        first_name,
        last_name,
        phone,
        photo
    )
values($1, $2, $3, $4, $5, 'profile.png')
returning id