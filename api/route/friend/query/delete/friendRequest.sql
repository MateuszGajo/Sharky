delete from friends
where id = $1
    and not exists(
        select id
        from friends
        where id = $1
            and status = '1'
    )