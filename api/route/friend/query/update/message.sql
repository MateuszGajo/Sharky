update chats
set message_to = null
where friendship_id = (
        select id
        from friends
        where (
                user_id_1 = $1
                and user_id_2 = $2
            )
            or (
                user_id_1 = $2
                and user_id_2 = $1
            )
    )