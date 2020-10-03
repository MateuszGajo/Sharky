delete from friends
where id = (
        select id
        from friends
        where user_id_1 = $1
            and user_id_2 = $2
        union
        select id
        from friends
        where user_id_1 = $2
            and user_id_2 = $1
    )