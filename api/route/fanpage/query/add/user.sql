insert into fanpage_users(fanpage_id, user_id, role)
select $1,
    $2,
    $3
where not exists(
        select id
        from fanpage_users
        where fanpage_id = $1
            and user_id = $2
    )
returning id