insert into chat_messages(message, date, user_id, chat_id)
select $1,
    $2,
    $3,
    id
from chats
where friendship_id = (
        select id
        from friends
        where (
                user_id_1 = $3
                and user_id_2 = $4
            )
            or (
                user_id_1 = $4
                and user_id_2 = $3
            )
    )
returning id