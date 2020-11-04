update friend_relations
set user_id = null,
    new_relation = null,
    relation = $1
where friendship_id = (
        select id
        from friends
        where (
                id = $2
                and user_id_1 = $3
                and user_id_2 = $4
            )
            or (
                (
                    id = $2
                    and user_id_1 = $4
                    and user_id_2 = $3
                )
            )
    )