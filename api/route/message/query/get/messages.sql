select c.id,
    c.chat_id as "chatId",
    c.user_id as "userId",
    c.message,
    c.date
from chat_messages as c
where chat_id = (
        select id
        from chats
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
    )