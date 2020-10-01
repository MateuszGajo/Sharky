insert into group_users(group_id, user_id, status)
select $1,
    $2,
    '0'
where not exists(
        select *
        from group_users
        where group_id = $1
            and user_id = $2
    )