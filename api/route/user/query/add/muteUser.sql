insert into user_mutes(user_id_1, user_id_2, date)
select $1,
    $2,
    $3
where not exists (
        select id
        from user_mutes
        where user_id_1 = $1
            and user_id_2 = $2
    )