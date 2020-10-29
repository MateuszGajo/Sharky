update friend_relations
set new_relation = $1,
    user_id = $2
where friendship_id = (
        select id
        from friends
        where (
                user_id_1 = $2
                and user_id_2 = $3
            )
            or (
                user_id_1 = $3
                and user_id_2 = $2
            )
    )