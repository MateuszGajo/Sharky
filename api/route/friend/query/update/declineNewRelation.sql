update friend_relations
set user_id = null,
    new_relation = null
where friendship_id = (
        select id
        from friends
        where (
                id = $1
                and user_id_1 = $2
                and user_id_2 = $3
            )
            or (
                (
                    id = $1
                    and user_id_1 = $3
                    and user_id_2 = $2
                )
            )
    )