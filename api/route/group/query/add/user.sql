insert into group_users(group_id, user_id, status, role, date)
select $1,
    $2,
    '1',
    $3,
    $4
where not exists(
        select id
        from group_users
        where group_id = $1
            and user_id = $2
    )
returning id