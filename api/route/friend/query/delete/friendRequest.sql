delete from friends
where (
        (
            user_id_1 = $1
            and user_id_2 = $2
        )
        or (
            user_id_1 = $2
            and user_id_2 = $1
        )
    )
    and not exists(
        select id
        from friends
        where (
                user_id_1 = $1
                and user_id_2 = $2
                and status = '1'
            )
            or (
                user_id_1 = $2
                and user_id_2 = $1
                and status = '1'
            )
    )